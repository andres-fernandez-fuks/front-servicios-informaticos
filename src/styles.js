import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  disabledInput: {
        color: "#999999"
    },
  PaddedGrid: {
    marginTop: 50
  },
  SmallPaddedGrip: {
    marginTop: 10,
    alignItems: "left"
  },
  MediumPaddedGrip: {
    marginTop: 17,
    alignItems: "left"
  },
  BigPaddedGrip: {
    marginTop: 10,
    marginLeft: 8
  },
  LeftPaddedForm: {
    marginLeft: 2
  },
  centeredGrid: {
    alignItems: "center"
  },
  card: {
    minHeight: "820px",
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  visitsNumberContainer: {
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
    paddingBottom: theme.spacing(1),
  },
  progressSection: {
    marginBottom: theme.spacing(1),
  },
  progressTitle: {
    marginBottom: theme.spacing(2),
  },
  progress: {
    marginBottom: theme.spacing(1),
    backgroundColor: "rgb(236, 236, 236)",
  },
  pieChartLegendWrapper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: theme.spacing(1),
  },
  legendItemContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  fullHeightBody: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  tableWidget: {
    overflowX: "auto",
  },
  progressBarPrimary: {
    backgroundColor: theme.palette.primary.main,
  },
  progressBarWarning: {
    backgroundColor: theme.palette.warning.main,
  },
  performanceLegendWrapper: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  legendElement: {
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(2),
  },
  legendElementText: {
    marginLeft: theme.spacing(1),
  },
  serverOverviewElement: {
    display: "flex",
    alignItems: "center",
    maxWidth: "100%",
  },
  serverOverviewElementText: {
    minWidth: 145,
    paddingRight: theme.spacing(2),
  },
  serverOverviewElementChartWrapper: {
    width: "100%",
  },
  mainChartBody: {
    overflowX: "auto",
  },
  mainChartHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    [theme.breakpoints.only("xs")]: {
      flexWrap: "wrap",
    },
  },
  mainChartHeaderLabels: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.only("xs")]: {
      order: 3,
      width: "100%",
      justifyContent: "center",
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
    },
  },
  mainChartHeaderLabel: {
    display: "flex",
    alignItems: "center",
    marginLeft: theme.spacing(3),
  },
  tableHeader: {
    textAlign: "center",
  },
  tableCell: {
    textAlign: "center",
  },
  mainChartSelectRoot: {
    borderColor: theme.palette.text.hint + "80 !important",
  },
  mainChartSelect: {
    padding: 10,
    paddingRight: 25,
  },
  mainChartLegentElement: {
    fontSize: "18px !important",
    marginLeft: theme.spacing(1),
  },
  success: {
    backgroundColor: theme.palette.success.main,
    color: "#fff",
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
    color: "#fff",
  },
  secondary: {
    backgroundColor: theme.palette.secondary.main,
    color: "#fff",
  },
  tableMUI: {
    backgroundColor: "#1e1e2f",
  },
  logotypeImage: {
    width: 150,
    height: 80,
    marginTop: "-1.5%",
  },
  uploadButton: {
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: "1%",
    height: 40,
  },
  onlyButtonNoSpacing: {
    "& > *": {
      margin: theme.spacing(1),
    },
    paddingBottom:5,
    active: {
        border: "none"
    }
  },
  centeredDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentInput: {
    width: 150,
  }
}));
