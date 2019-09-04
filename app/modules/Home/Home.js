/* eslint-disable no-plusplus */
import React, { forwardRef, useRef } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import AutoSizer from 'react-virtualized-auto-sizer';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { FixedSizeList, FixedSizeGrid } from 'react-window';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Link from '@material-ui/core/Link';
import useStyles from './config/UseStyles';
import DataBase from '../../utils/IndexedDB';
import ClipBoard from '../../utils/Clipboard';
import DateFormat from '../../utils/DateFormat';
import useInterval from '../../utils/UseInterval';
import bannerImage from '../../assets/banner3.jpeg';
import blankPage from '../../assets/blank.png';

const clipBoard = new ClipBoard();
clipBoard.startWatching();

function MadeWithLove() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Built with love by the '}
            <Link color="inherit" href="https://material-ui.com/">
                sunxiuguo1@qq.com
            </Link>
        </Typography>
    );
}

const TYPE_MAP = {
    TEXT: 'text',
    IMAGE: 'image',
    HTML: 'html'
};

const LIST_ITEMS = [
    {
        id: 1,
        type: TYPE_MAP.HTML,
        label: '文本',
        icon: <TextFieldsIcon />
    },
    {
        id: 2,
        type: TYPE_MAP.IMAGE,
        label: '图像',
        icon: <ImageIcon />
    }
];

const clientHeight = window.innerHeight || document.body.clientHeight;
const recordItemGutter = 16;
const recordListPadding = 32;

export default function Dashboard() {
    const Db = new DataBase();
    const classes = useStyles();
    const [type, setType] = React.useState(TYPE_MAP.HTML);
    const [open, setOpen] = React.useState(true);
    const [imageList, setImageList] = React.useState([]);
    const [textList, setTextList] = React.useState([]);
    const [searchWords, setSearchWords] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalImageSrc, setModalImageSrc] = React.useState('');
    const [modalTextContent, setModalTextContent] = React.useState('');
    const [showScrollTopBtn, setScrollTopBtn] = React.useState(false);
    const textListRef = useRef(null);
    const imageListRef = useRef(null);

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

    useInterval(() => {
        const getImageList = async () => {
            const imageArray = await Db.get(TYPE_MAP.IMAGE);

            const imageListByDate = splitImageByDate(imageArray);

            if (JSON.stringify(imageListByDate) !== JSON.stringify(imageList)) {
                setImageList(imageListByDate);
            }
        };
        if (type === TYPE_MAP.IMAGE) {
            getImageList();
        }
    }, 500);

    const splitImageByDate = allImages => {
        const dateArrayMap = {};
        for (let i = 0; i < allImages.length; i++) {
            const item = allImages[i];
            const date = DateFormat.format(item.createTime, 'YYYY-MM-DD');
            if (!dateArrayMap[date]) {
                dateArrayMap[date] = [item];
            } else {
                dateArrayMap[date].push(item);
            }
        }
        return Object.values(dateArrayMap);
    };

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

    const handleDrawerClose = () => {
        setOpen(!open);
    };

    const handleClickItem = _type => {
        setScrollTopBtn(false);
        setType(_type);
    };

    const clearStore = _type => {
        Db.delete(_type);
        handleCloseMenu();
    };

    const handleClickImage = imageSrc => {
        setModalImageSrc(imageSrc);
        setModalOpen(true);
    };

    const handleClickText = content => {
        setModalTextContent(content);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalTextContent('');
        setModalImageSrc('');
        setModalOpen(false);
    };

    const renderArrowIcon = () =>
        open ? <ChevronLeftIcon /> : <ChevronRightIcon />;

    const renderListMenuItems = () =>
        LIST_ITEMS.map(item => (
            <Button
                variant="contained"
                color={type === item.type ? 'primary' : 'default'}
                className={classes.leftButton}
                onClick={() => handleClickItem(item.type)}
                key={item.id}
            >
                {item.label}
                {item.icon}
            </Button>
        ));

    const renderTextItem = props => {
        const { columnIndex, rowIndex, data, style } = props;
        const index = 2 * rowIndex + columnIndex;
        const item = data[index];
        // 点击打开modal时会重新触发transition
        // const timeout = index <= 4 ? index * 500 : 5 * 500;
        if (rowIndex > 3) {
            setScrollTopBtn(true);
        } else {
            setScrollTopBtn(false);
        }

        return (
            // <Grow
            //     in={type === 'text'}
            //     style={{ transformOrigin: '0 0 0' }}
            //     {...(type === 'text' ? { timeout } : {})}
            // >
            <Card
                className={classes.textCard}
                key={index}
                style={{
                    ...style,
                    left: style.left + recordItemGutter,
                    top: style.top + recordItemGutter,
                    height: style.height - recordItemGutter,
                    width: style.width - recordItemGutter
                }}
            >
                <CardActionArea onClick={() => handleClickText(item.content)}>
                    <CardMedia
                        component="img"
                        className={classes.textMedia}
                        image={bannerImage}
                    />
                    <CardContent className={classes.textItemContentContainer}>
                        <div
                            dangerouslySetInnerHTML={{ __html: item.content }}
                            style={{
                                height: 330,
                                maxHeight: 330,
                                width: '100%',
                                overflow: 'scroll',
                                marginBottom: 10
                            }}
                        />
                        <Typography className={classes.textItemTime}>
                            {DateFormat.format(item.createTime)}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            // </Grow>
        );
    };

    const renderDateImageItem = props => {
        const { index, data, style } = props;
        const dateImages = data[index];
        // 点击打开modal时会重新触发transition
        // const timeout = index <= 3 ? index * 1000 : 2 * 1000;
        if (index > 3) {
            setScrollTopBtn(true);
        } else {
            setScrollTopBtn(false);
        }

        return (
            // <Grow
            //     in={type === 'image'}
            //     style={{ transformOrigin: '0 0 0' }}
            //     {...(type === 'image' ? { timeout } : {})}
            // >
            <GridListTile
                key={index}
                style={{
                    ...style,
                    top: style.top + recordItemGutter,
                    height: style.height - recordItemGutter
                }}
                className={classes.gridItem}
            >
                <ListSubheader component="div">
                    <Typography variant="h6" color="textSecondary">
                        {DateFormat.format(
                            dateImages[0].createTime,
                            'YYYY-MM-DD'
                        )}
                    </Typography>
                </ListSubheader>
                {renderImageList(dateImages)}
            </GridListTile>
            // </Grow>
        );
    };

    const renderTextList = () => (
        <AutoSizer>
            {({ height, width }) => (
                <FixedSizeGrid
                    height={height}
                    width={width}
                    columnCount={2}
                    columnWidth={width / 2}
                    rowCount={Math.ceil(textList.length / 2)}
                    rowHeight={400 + recordItemGutter}
                    innerElementType={gridInnerElementType}
                    outerRef={textListRef}
                    itemData={textList}
                >
                    {renderTextItem}
                </FixedSizeGrid>
            )}
        </AutoSizer>
    );

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

    const renderImageList = dateImages => (
        <div className={classes.imgRoot}>
            <GridList className={classes.imgGridList} cols={4}>
                {dateImages.map(item => (
                    <GridListTile
                        key={item.id}
                        cols={1}
                        style={{ background: 'rgb(220, 239, 237)' }}
                        onClick={() => handleClickImage(item.content)}
                    >
                        <img
                            src={item.contentLow}
                            alt={DateFormat.format(item.createTime)}
                        />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );

    const listInnerElementType = forwardRef(({ style, ...rest }, ref) => (
        <div
            ref={ref}
            style={{
                ...style,
                paddingTop: recordItemGutter,
                height: `${parseFloat(style.height) + recordListPadding * 2}px`
            }}
            {...rest}
        />
    ));

    const gridInnerElementType = forwardRef(({ style, ...rest }, ref) => (
        <div
            ref={ref}
            style={{
                ...style,
                paddingTop: recordItemGutter,
                paddingLeft: recordItemGutter,
                height: `${parseFloat(style.height) + recordListPadding * 2}px`
            }}
            {...rest}
        />
    ));

    const renderContentList = () => {
        switch (type) {
            case TYPE_MAP.HTML:
                return textList.length ? renderTextList() : renderBlankPage();
            case TYPE_MAP.IMAGE:
                return imageList.length
                    ? renderDateImageList()
                    : renderBlankPage();
            default:
                return '未识别的类型';
        }
    };

    const renderBlankPage = () => (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                marginTop: -0.1 * clientHeight,
                flexDirection: 'column'
            }}
        >
            <img src={blankPage} alt="空白页" />
            <div>
                <Typography variant="h6" color="textPrimary">
                    <span>剪贴板中还没有任何记录哦~</span>
                </Typography>
            </div>
        </div>
    );

    const renderModal = () => (
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={modalOpen}
            onClose={handleCloseModal}
            onEscapeKeyDown={handleCloseModal}
            className={classes.modal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <Fade in={modalOpen}>
                <div
                    style={{
                        top: `50%`,
                        left: `50%`,
                        transform: `translate(-50%, -50%)`
                    }}
                    className={classes.modalContainer}
                >
                    {renderModalBody()}
                </div>
            </Fade>
        </Modal>
    );

    const renderModalBody = () => {
        if (modalImageSrc) {
            return (
                <img
                    src={modalImageSrc}
                    alt="查看大图"
                    style={{ width: '100%' }}
                />
            );
        }
        if (modalTextContent) {
            return (
                <div dangerouslySetInnerHTML={{ __html: modalTextContent }} />
            );
        }
    };

    const onSearchInputChange = e => {
        setSearchWords(e.currentTarget.value);
    };

    const handleClickMenu = e => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            {renderModal()}
            <CssBaseline />
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(
                        classes.drawerPaper,
                        !open && classes.drawerPaperClose
                    )
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        {renderArrowIcon()}
                    </IconButton>
                </div>
                <Divider />
                {renderListMenuItems()}
            </Drawer>
            <main className={classes.content}>
                <AppBar position="static">
                    <Toolbar id="back-to-top-anchor">
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                            aria-haspopup="true"
                            onClick={handleClickMenu}
                            aria-controls="simple-menu"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                        >
                            <MenuItem onClick={() => clearStore(TYPE_MAP.HTML)}>
                                清空文本记录
                            </MenuItem>
                            <MenuItem
                                onClick={() => clearStore(TYPE_MAP.IMAGE)}
                            >
                                清空图片记录
                            </MenuItem>
                        </Menu>
                        <Typography
                            className={classes.SearchBarTitle}
                            variant="h6"
                            noWrap
                        >
                            VisualClipboard
                        </Typography>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                onChange={onSearchInputChange}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="lg" className={classes.container}>
                    {renderContentList()}
                </Container>

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

                <MadeWithLove />
            </main>
        </div>
    );
}
