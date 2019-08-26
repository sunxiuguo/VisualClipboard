import React from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Container from '@material-ui/core/Container';
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

    useInterval(() => {
        const getTextList = async () => {
            const textArray = await Db.get('text');
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
    };

    const renderArrowIcon = () =>
        open ? <ChevronLeftIcon /> : <ChevronRightIcon />;

    const renderListMenuItems = () =>
        LIST_ITEMS.map(item => (
            <ListItem
                button
                onClick={() => handleClickItem(item.type)}
                key={item.id}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
            </ListItem>
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
                <List>{renderListMenuItems()}</List>
            </Drawer>
            <main className={classes.content}>
                <Container maxWidth="lg" className={classes.container}>
                    {renderContentList()}
                    <Button onClick={() => clearStore('text')}>
                        清除text记录
                    </Button>
                    <Button onClick={() => clearStore('image')}>
                        清除image记录
                    </Button>
                </Container>

                <MadeWithLove />
            </main>
        </div>
    );
}
