import React from 'react';
import clsx from 'clsx';
// import 'date-fns';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
// import Grid from '@material-ui/core/Grid';
// import DateFnsUtils from '@date-io/date-fns';
// import {
//   MuiPickersUtilsProvider,
//   DateTimePicker
// } from '@material-ui/pickers';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
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
import DateFormat from '../../utils/Utils';
import useInterval from '../../utils/UseInterval';

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

export default function Dashboard() {
    const Db = new DataBase();
    const classes = useStyles();
    const [type, setType] = React.useState('text');
    const [open, setOpen] = React.useState(true);
    const [imageList, setImageList] = React.useState([]);
    const [textList, setTextList] = React.useState([]);
    const [searchWords, setSearchWords] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    // const [selectedStartDate, setStartDate] = React.useState(0);
    // const [selectedEndDate, setEndDate] = React.useState(0);

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
            const avaliableArray = imageArray.filter(
                item => item.content.length > 'data:image/png;base64,'.length
            );
            if (JSON.stringify(avaliableArray) !== JSON.stringify(imageList)) {
                setImageList(avaliableArray);
            }
        };
        if (type === 'image') {
            getImageList();
        }
    }, 500);

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

    const renderTextList = () =>
        textList.map(item => (
            <ExpansionPanel
                key={item.id}
                TransitionProps={{ unmountOnExit: true }}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.expansionHeader}>
                        {DateFormat(item.createTime)}
                    </Typography>
                    <Typography className={classes.expansionSecondaryHeader}>
                        {item.content}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>{item.content}</Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        ));

    const renderImageList = () => (
        <div className={classes.imgRoot}>
            <GridList
                cellHeight="auto"
                className={classes.imgGridList}
                cols={2}
            >
                {imageList.map(item => (
                    <GridListTile
                        key={Math.random()}
                        cols={2}
                        className={classes.imgFullWidth}
                    >
                        <Paper className={classes.gridPaper}>
                            <img
                                src={item.content}
                                alt=""
                                style={{
                                    width: '100%',
                                    height: `(1 / ${item.ratio}) * 100%`
                                }}
                            />
                        </Paper>
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );

    const renderContentList = () => {
        switch (type) {
            case 'text':
                return renderTextList();
            case 'image':
                return renderImageList();
            default:
                return '未识别的类型';
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

    // const handleStartDateChange = (date) => {
    //     setStartDate(new Date(date).getTime());
    // }

    // const handleEndDateChange = (date) => {
    //     setEndDate(new Date(date).getTime());
    // }

    return (
        <div className={classes.root}>
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
                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid
                        container
                        justify="space-around"
                    >
                        <DateTimePicker
                            variant="inline"
                            format="yyyy/MM/dd HH:mm"
                            margin="normal"
                            inputVariant="outlined"
                            label="开始时间"
                            value={selectedStartDate}
                            onChange={handleStartDateChange}
                        />
                        <DateTimePicker
                            variant="inline"
                            format="yyyy/MM/dd HH:mm"
                            margin="normal"
                            inputVariant="outlined"
                            label="结束时间"
                            value={selectedEndDate}
                            onChange={handleEndDateChange}
                        />
                    </Grid>
                </MuiPickersUtilsProvider> */}
                <Container maxWidth="lg" className={classes.container}>
                    {renderContentList()}
                </Container>

                <MadeWithLove />
            </main>
        </div>
    );
}
