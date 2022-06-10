import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  text: {
    marginBottom: theme.spacing(2),
  },
  buttonSpacing: {
    "& > *": {
      margin: theme.spacing(1),
    },
    display: "flex",
    marginLeft: "15em",
    marginTop: "2%",
    marginBottom: "3%",
  },
  generalPurposeItems: {
    display: "flex",
    marginLeft: "1em",
    marginTop: "1%",
    width: 550,
    justifyContent: "space-between",
  },
  smallItems: {
    display: "flex",
    marginLeft: "1em",
    marginTop: "1%",
    width: 350,
    justifyContent: "space-between",
  },
  generalPurposeField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: "-1%",
    width: 350,
    "& input::placeholder": {
      background: "rgba(0, 0, 0, 0)",
      color: "rgba(0,0,0, 1)",
    },
  },
  smallField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: "-2%",
    width: 230,
  },
  selectorField: {
    marginRight: theme.spacing(1),
    marginTop: "-1%",
    width: 170,
  },
  logotypeImage: {
    width: 157,
    height: 60,
    marginTop: "-1%",
  },
  loader: {
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: "5%",
    marginBottom: "-1%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "350%",
  },
  loaderBar: {
    marginTop: "5%",
    marginBottom: "30%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "350%",
  },
  onlyButtonSpacing: {
    "& > *": {
      margin: theme.spacing(1),
    },
    height: 15,
    alignItem: "center",
  },
  onlyButtonNoSpacing: {
    "& > *": {
      margin: theme.spacing(1),
    },
    height: 10,
    marginTop:5
  }
}));
