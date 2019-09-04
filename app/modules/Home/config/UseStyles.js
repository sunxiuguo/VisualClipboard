import { makeStyles, fade } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        overflow: 'hidden'
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    textArea: {
        '&:focus': {
            outline: 'none'
        },
        overflow: 'hidden',
        border: 0,
        width: '100%',
        height: 'auto',
        fontSize: '1rem',
        fontWeight: 500,
        resize: 'none'
    },
    SearchBarTitle: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        }
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto'
        }
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputRoot: {
        color: 'inherit'
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200
            }
        }
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        marginTop: theme.spacing(2),
        ...theme.mixins.toolbar
    },
    imgRoot: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        backgroundColor: theme.palette.background.paper
    },
    imgGridList: {
        width: '100%',
        height: 360
    },
    gridPaper: {
        padding: theme.spacing(2),
        background: '#FF7400'
    },
    gridItem: {
        boxShadow:
            '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
        padding: 0,
        marginBottom: '1rem',
        borderRadius: theme.shape.borderRadius,
        backgroundImage: 'linear-gradient(54deg, #e5e5e5 0%, #F5F5F5 97%)'
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: theme.spacing(20),
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(8)
        }
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        width: theme.spacing(100)
        // overflow: 'auto'
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        height: '100vh',
        overflow: 'auto'
    },
    leftButton: {
        width: '80%',
        marginTop: theme.spacing(2),
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    modal: {
        overflow: 'scroll'
    },
    modalContainer: {
        position: 'absolute',
        width: theme.spacing(100),
        maxHeight: '90%',
        backgroundColor: theme.palette.background.paper,
        // border: '2px solid #000',
        boxShadow: theme.shadows[5]
    },
    textCard: {
        maxWidth: '100%',
        width: '100%',
        paddingBottom: theme.spacing(2)
    },
    textMedia: {
        height: 50,
        minHeight: 50
    },
    textItemContentContainer: {
        height: 300,
        padding: '10px 8px 10px 8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    textItemContent: {
        fontSize: theme.typography.body1,
        color: theme.palette.text.primary,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        /*! autoprefixer: off */
        WebkitBoxOrient: 'vertical'
    },
    textItemTime: {
        color: theme.palette.text.secondary
    },
    scrollTopBtn: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    }
}));

export default useStyles;
