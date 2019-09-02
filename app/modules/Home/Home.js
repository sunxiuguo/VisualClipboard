/* eslint-disable no-plusplus */
import React, { forwardRef } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import Grow from '@material-ui/core/Grow';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { FixedSizeList } from 'react-window';

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

const LIST_ITEMS = [
    {
        id: 1,
        type: 'text',
        label: '文本',
        icon: <TextFieldsIcon />
    },
    {
        id: 2,
        type: 'image',
        label: '图像',
        icon: <ImageIcon />
    }
];

const clientHeight = window.innerHeight || document.body.clientHeight;
const textItemGutter = 16;

export default function Dashboard() {
    const Db = new DataBase();
    const classes = useStyles();
    const [type, setType] = React.useState('text');
    const [open, setOpen] = React.useState(true);
    const [imageList, setImageList] = React.useState([]);
    const [textList, setTextList] = React.useState([]);
    const [searchWords, setSearchWords] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalImageSrc, setModalImageSrc] = React.useState('');
    const [modalTextContent, setModalTextContent] = React.useState('');

    useInterval(() => {
        const getTextList = async () => {
            let textArray = await Db.get('text');
            if (searchWords) {
                textArray = textArray.filter(
                    item => item.content.indexOf(searchWords) > -1
                );
            }
            if (JSON.stringify(textArray) !== JSON.stringify(textList)) {
                setTextList(textArray);
            }
        };
        if (type === 'text') {
            getTextList();
        }
    }, 500);

    useInterval(() => {
        const getImageList = async () => {
            const imageArray = await Db.get('image');

            const imageListByDate = splitImageByDate(imageArray);

            if (JSON.stringify(imageListByDate) !== JSON.stringify(imageList)) {
                setImageList(imageListByDate);
            }
        };
        if (type === 'image') {
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

    const handleDrawerClose = () => {
        setOpen(!open);
    };

    const handleClickItem = _type => {
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
        const { index, data, style } = props;
        const item = data[index];
        const timeout = index <= 4 ? index * 500 : 5 * 500;

        return (
            <Grow
                in={type === 'text'}
                style={{ transformOrigin: '0 0 0' }}
                {...(type === 'text' ? { timeout } : {})}
            >
                <Card
                    className={classes.textCard}
                    key={index}
                    style={{
                        ...style,
                        top: style.top + textItemGutter,
                        height: style.height - textItemGutter
                    }}
                >
                    <CardActionArea
                        onClick={() => handleClickText(item.content)}
                    >
                        <CardMedia
                            component="img"
                            className={classes.textMedia}
                            image={bannerImage}
                        />
                        <CardContent
                            className={classes.textItemContentContainer}
                        >
                            <Typography className={classes.textItemContent}>
                                {item.content}
                            </Typography>
                            <Typography className={classes.textItemTime}>
                                {DateFormat.format(item.createTime)}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grow>
        );
    };

    const renderDateImageItem = props => {
        const { index, data, style } = props;
        const dateImages = data[index];
        const timeout = index <= 3 ? index * 1000 : 2 * 1000;

        return (
            <Grow
                in={type === 'image'}
                style={{ transformOrigin: '0 0 0' }}
                {...(type === 'image' ? { timeout } : {})}
            >
                <GridListTile
                    key={index}
                    style={{
                        ...style,
                        top: style.top + textItemGutter,
                        height: style.height - textItemGutter
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
            </Grow>
        );
    };

    const renderDateImageList = () => (
        <div className={classes.imgRoot}>
            <FixedSizeList
                height={clientHeight}
                width="100%"
                itemSize={400}
                itemCount={imageList.length}
                itemData={imageList}
                innerElementType={innerElementType}
            >
                {renderDateImageItem}
            </FixedSizeList>
        </div>
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

    const innerElementType = forwardRef(({ style, ...rest }, ref) => (
        <div
            ref={ref}
            style={{
                ...style,
                paddingTop: textItemGutter
            }}
            {...rest}
        />
    ));

    const renderContentList = () => {
        switch (type) {
            case 'text':
                return (
                    <FixedSizeList
                        height={clientHeight}
                        width="100%"
                        itemSize={190}
                        itemCount={textList.length}
                        itemData={textList}
                        innerElementType={innerElementType}
                    >
                        {renderTextItem}
                    </FixedSizeList>
                );
            case 'image':
                return renderDateImageList();
            default:
                return '未识别的类型';
        }
    };

    const renderModal = () => (
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={modalOpen}
            onClose={handleCloseModal}
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
                <TextareaAutosize
                    defaultValue={modalTextContent}
                    className={classes.textArea}
                />
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
                    <Toolbar>
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
                            <MenuItem onClick={() => clearStore('text')}>
                                清空文本记录
                            </MenuItem>
                            <MenuItem onClick={() => clearStore('image')}>
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

                <MadeWithLove />
            </main>
        </div>
    );
}
