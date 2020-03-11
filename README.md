<div align="center">

![Visual Clipboard](https://user-gold-cdn.xitu.io/2020/2/14/17042e20a1755c98?w=1383&h=887&f=png&s=173305)

</div>

## 本地运行
`npm run start `

## 打包
`npm run build`

## 介绍

VisualClipBoard 是一款剪贴板工具，能够记录您复制、剪切的所有图片、文本、超文本历史。  
此项目基于electron-react-boilerplate搭建, 启动后后台运行, 无论在何处复制都会被记录在visualClipboard中。

## 支持格式

-   支持文本
-   支持图片
-   支持 excel 表格
-   支持html

## 特性

-   自动存储您所复制的内容
-   存储 7 天的数据，过期数据自动清理
-   关键字筛选
-   列表瀑布流
-   列表缩略显示，点击弹窗显示详情


## 背景
女票：有的时候复制粘贴过的内容还想再看一下，然而又忘了原来的内容是在哪了，找起来还挺麻烦的  

我：看爸爸给你写个app，允你免费试用！  

女票：？？给你脸了？

![](https://user-gold-cdn.xitu.io/2020/2/14/17042da62a7e8d56?w=283&h=268&f=jpeg&s=8608)


## 动手

`咳咳 是动手开始写代码, 不是被女票动手打`

虽然从来没写过electron，但是记得这货是支持 [剪贴板API](https://www.electronjs.org/docs/api/clipboard) 的，那就撸袖子开始干，就当练练手了！

首先明确我们的目标：
* 实时获取系统剪贴板的内容（包括但不限于文本、图像）
* 存储获取到的信息
* 展示存储的信息列表
* 能够快速查看某一项纪录并再次复制
* 支持关键字搜索

### 监听系统剪贴板

监听系统剪贴板，暂时的实现是定时去读剪贴板当前的内容，定时任务使用的是node-schedule，可以很方便地设置频率。
```javascript
// 这里是每秒都去拿一次剪贴板的内容，然后进行存储
startWatching = () => {
    if (!this.watcherId) {
        this.watcherId = schedule.scheduleJob('* * * * * *', () => {
            Clipboard.writeImage();
            Clipboard.writeHtml();
        });
    }
    return clipboard;
};
```

### 存储

目前只是本地应用，还没有做多端的同步，所以直接用了indexDB来做存储。  
上面代码中的`Clipboard.writeImage()`以及`Clipboard.writeHtml()`就是向indexDB中写入。

* **文本的存储很简单，直接读取，写入即可**

```javascript
static writeHtml() {
    if (Clipboard.isDiffText(this.previousText, clipboard.readText())) {
        this.previousText = clipboard.readText();
        Db.add('html', {
            createTime: Date.now(),
            html: clipboard.readHTML(),
            content: this.previousText
        });
    }
}
```

* **图像这里就比较坑了**  

  `老哥们如果有更好的方法欢迎提出，我学习一波。因为我是第一次写，贼菜，实在没想到其他的方法...`
1. 从剪贴板读取到的是NativeImage对象  
2. 本来想转换为base64存储，尝试过后放弃了，因为存储的内容太大了，会非常卡。
3. 最终实现是将读到的图像存储为本地临时文件,以{md5}.jpeg命名
4. indexDB中直接存储md5值，使用的时候直接用md5.jpeg访问即可


```javascript
static writeImage() {
    const nativeImage = clipboard.readImage();

    const jpegBufferLow = nativeImage.toJPEG(jpegQualityLow);
    const md5StringLow = md5(jpegBufferLow);

    if (Clipboard.isDiffText(this.previousImageMd5, md5StringLow)) {
        this.previousImageMd5 = md5StringLow;
        if (!nativeImage.isEmpty()) {
            const jpegBuffer = nativeImage.toJPEG(jpegQualityHigh);
            const md5String = md5(jpegBuffer);
            const now = Date.now();
            const pathByDate = `${hostPath}/${DateFormat.format(
                now,
                'YYYYMMDD'
            )}`;
            xMkdirSync(pathByDate);
            const path = `${pathByDate}/${md5String}.jpeg`;
            const pathLow = `${pathByDate}/${md5StringLow}.jpeg`;
            fs.writeFileSync(pathLow, jpegBufferLow);

            Db.add('image', {
                createTime: now,
                content: path,
                contentLow: pathLow
            });
            fs.writeFile(path, jpegBuffer, err => {
                if (err) {
                    console.error(err);
                }
            });
        }
    }
}
```

* **删除过期的临时图像文件**  
由于图像文件我们是临时存储在硬盘里的，为了防止存有太多垃圾文件，添加了过期清理的功能。

```javascript
startWatching = () => {
    if (!this.deleteSchedule) {
        this.deleteSchedule = schedule.scheduleJob('* * 1 * * *', () => {
            Clipboard.deleteExpiredRecords();
        });
    }
    return clipboard;
};
    
static deleteExpiredRecords() {
    const now = Date.now();
    const expiredTimeStamp = now - 1000 * 60 * 60 * 24 * 7;
    // delete record in indexDB
    Db.deleteByTimestamp('html', expiredTimeStamp);
    Db.deleteByTimestamp('image', expiredTimeStamp);

    // remove jpg with fs
    const dateDirs = fs.readdirSync(hostPath);
    dateDirs.forEach(dirName => {
        if (
            Number(dirName) <=
            Number(DateFormat.format(expiredTimeStamp, 'YYYYMMDD'))
        ) {
            rimraf(`${hostPath}/${dirName}`, error => {
                if (error) {
                    console.error(error);
                }
            });
        }
    });
}
```

### 展示列表

上面已经完成了定时的写入db，接下来我们要做的是实时展示db中存储的内容。

**1. 定义userInterval来准备定时刷新**

```javascript
/**
 * react hooks - useInterval
 * https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks/
 */

import { useEffect, useRef } from 'react';

export default function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        // 当delay === null时, 暂停interval
        if (delay !== null) {
            const timer = setInterval(tick, delay);
            return () => clearInterval(timer);
        }
    }, [delay]);
}

```
**2. 使用userInterval展示列表**

```javascript
const [textList, setTextList] = React.useState([]);

useInterval(() => {
    const getTextList = async () => {
        let textArray = await Db.get(TYPE_MAP.HTML);
        if (searchWords) {
            textArray = textArray.filter(
                item => item.content.indexOf(searchWords) > -1
            );
        }
        if (JSON.stringify(textArray) !== JSON.stringify(textList)) {
            setTextList(textArray);
        }
    };
    if (type === TYPE_MAP.HTML) {
        getTextList();
    }
}, 500);
```

### 渲染列表项

我们的列表项中需要包含
1. 主体内容
2. 剪贴内容的时间
3. 复制按钮，以更方便地复制列表项内容
4. 对于比较长的内容，需要支持点击弹窗显示全部内容

```javascript
const renderTextItem = props => {
    const { columnIndex, rowIndex, data, style } = props;
    const index = 2 * rowIndex + columnIndex;
    const item = data[index];
    if (!item) {
        return null;
    }
    
    if (rowIndex > 3) {
        setScrollTopBtn(true);
    } else {
        setScrollTopBtn(false);
    }
    
    return (
        <Card
            className={classes.textCard}
            key={index}
            style={{
                ...style,
                left: style.left,
                top: style.top + recordItemGutter,
                height: style.height - recordItemGutter,
                width: style.width - recordItemGutter
            }}
        >
            <CardActionArea>
                <CardMedia
                    component="img"
                    className={classes.textMedia}
                    image={bannerImage}
                />
                <CardContent className={classes.textItemContentContainer}>
                    ...
                </CardContent>
            </CardActionArea>
            <CardActions
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <Chip
                    variant="outlined"
                    icon={<AlarmIcon />}
                    label={DateFormat.format(item.createTime)}
                />
                <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={() => handleClickText(item.content)}
                >
                    复制
                </Button>
            </CardActions>
        </Card>
    );
};
```

**从剪贴板中读到的内容，需要按照原有格式展示**  

恰好`clipboard.readHTML([type])`可以直接读到html内容，那么我们只需要正确展示html内容即可。
```javascript
<div
    dangerouslySetInnerHTML={{ __html: item.html }}
    style={{
        height: 300,
        maxHeight: 300,
        width: '100%',
        overflow: 'scroll',
        marginBottom: 10
    }}
/>
```

**列表太长，还得加一个回到顶部的按钮**

```javascript
<Zoom in={showScrollTopBtn}>
    <div
        onClick={handleClickScrollTop}
        role="presentation"
        className={classes.scrollTopBtn}
    >
        <Fab
            color="secondary"
            size="small"
            aria-label="scroll back to top"
        >
            <KeyboardArrowUpIcon />
        </Fab>
    </div>
</Zoom>

const handleClickScrollTop = () => {
    const options = {
        top: 0,
        left: 0,
        behavior: 'smooth'
    };
    if (textListRef.current) {
        textListRef.current.scroll(options);
    } else if (imageListRef.current) {
        imageListRef.current.scroll(options);
    }
};
```

### 使用react-window优化长列表
列表元素太多，浏览时间长了会卡顿，使用react-window来优化列表展示，可视区域内只展示固定元素数量。

```javascript
import { FixedSizeList, FixedSizeGrid } from 'react-window';

const renderDateImageList = () => (
    <AutoSizer>
        {({ height, width }) => (
            <FixedSizeList
                height={height}
                width={width}
                itemSize={400}
                itemCount={imageList.length}
                itemData={imageList}
                innerElementType={listInnerElementType}
                outerRef={imageListRef}
            >
                {renderDateImageItem}
            </FixedSizeList>
        )}
    </AutoSizer>
);
```


## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019 - 2020 sunxiuguo
