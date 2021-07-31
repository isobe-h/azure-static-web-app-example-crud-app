import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { FC } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: "white",
  },
  title: {
    flexGrow: 1,
  },
}));
type Props = {
  userName?: string;
};

const MenuAppBar: FC<Props> = ({ userName }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Azure Static Web Apps CRUD
          </Typography>
          {userName && (
            <a className={classes.menuButton} href="/logout">
              サインアウト
            </a>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default MenuAppBar;
