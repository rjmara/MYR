import React from 'react';
import {
  Button,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  TextField
} from '@material-ui/core';

import { withStyles } from "@material-ui/core/styles";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

// CSS for modal
const modelStyles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  button: {
    margin: theme.spacing.unit,
  }
});


class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteFunc: this.props.deleteFunc,
      showImg: false,
      anchorEl: null,
      qrCodeOpen: false,
      pwProtectOpen: false,
      shareOpen: false,
      email: "",
      sendTo: []
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleTextChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleAddEmail = () => {
    let arr = [].concat(this.state.sendTo);
    arr.push(this.state.email);
    this.setState({ sendTo: arr, email: "" });
  }

  handleQrToggle = () => {
    this.setState({ qrCodeOpen: !this.state.qrCodeOpen });
  }

  handlePwToggle = () => {
    this.setState({ pwProtectOpen: !this.state.pwProtectOpen });
  }

  handleShrToggle = () => {
    this.setState({ shareOpen: !this.state.shareOpen });
  }

  pwProtect = () => (
    <div>
      <h5>Please enter a PW.</h5>
      <TextField
        id="standard-name"
        type="password"
        label="Password"
        value={this.state.email}
        onChange={this.handleTextChange('email')}
        margin="normal"
      />
      <Button
        onClick={this.handlePwToggle} >
        Save
      </Button>
      <p style={{ fontSize: "80%", marginTop: 10 }}>
        <b>Legal disclaimer:</b> This will only slow down people from accessing your work. MYR is not sutiable for sensitive information.
      </p>
    </div>
  );

  shareOptions = () => (
    <div>
      <h5>Enter one or more email addresses</h5>
      {
        this.state.sendTo.map(x => {
          return <p>{x}</p>;
        })
      }
      <TextField
        id="standard-name"
        label="Email"
        value={this.state.email}
        onChange={this.handleTextChange('email')}
        margin="normal"
      />
      <IconButton
        variant="raised"
        onClick={this.handleAddEmail}
        color="primary">
        <Icon className="material-icons">add</Icon>
      </IconButton>
      <Button
        href={`mailto:${this.state.sendTo.join(", ")}?subject="Check out my VR Scene in MYR&body=You can find my scene at ${window.location.href}`}>
        Send
      </Button>
    </div>
  );

  qrCodeOpen = () => {
    return (
      <div>
        <h5>QR Code to Your Project</h5>
        <img src="https://store-images.s-microsoft.com/image/apps.33967.13510798887182917.246b0a3d-c3cc-46fc-9cea-021069d15c09.392bf5f5-ade4-4b36-aa63-bb15d5c3817a?mode=scale&q=90&h=270&w=270&background=%230078D7" />
      </div>
    );
  };

  helper = (proj, canDelete) => {
    if (proj) {
      let id = proj.id;
      let name = proj.data.name;
      return (
        <div key={id} id={id} title={name}
          className="proj col-xs-12 col-md-6 col-lg-4 pt-2 pl-0" >
          <a href={`/${id}`} >
            <span className="project-span">{name}</span>
            <img id={id} alt={id} src={proj.url}
              className={"img-thumbnail " + (this.state.showImg && "d-none")} />
          </a>
          {canDelete ?
            <span className="scene-btns">
              <IconButton
                id="new-btn"
                color="primary"
                onClick={this.handleClick}
                className="" >
                <Icon className="material-icons">settings</Icon>
              </IconButton>
              <IconButton
                label="delete Project"
                color="secondary"
                className="delete-btn"
                fullwidth={String(!this.state.showImg)}
                onClick={() => this.props.deleteFunc(id, proj.data.name)}>
                <Icon className="material-icons">delete</Icon>
              </IconButton>
            </span>
            : null
          }
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    const { classes } = this.props;
    let previewToggle = {
      position: 'fixed ',
      top: 0,
      right: "46%"
    };
    const userProjs = [].concat(this.props.userProjs);
    const examplProjs = [].concat(this.props.examplProjs);
    return (
      <div id="project-list" >
        <div className="row" id="user-proj" style={{ width: "100%" }}>
          <h3 className="col-12 p-0 mb-3 border-bottom"> Your Projects </h3>
          <Button
            style={previewToggle}
            onClick={() => this.setState({ showImg: !this.state.showImg })}>
            { // If we are showing the img, show the proper icon
              this.state.showImg
                ?
                <Icon className="material-icons">visibility_off</Icon>
                :
                <Icon className="material-icons">visibility</Icon>
            }
            <span>&nbsp;</span>Preview
        </Button>
          <hr />
          { // Sort the users projects in alphabetical order
            userProjs.sort(function (a, b) {
              return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            }).map(proj => {
              return this.helper(proj, true);
            })
          }
        </div>
        <div className="row" id="sample-proj" style={{ width: "100%" }}>
          <h3 className="col-12 p-2 mb-3 border-bottom">Sample Projects</h3>
          <hr />
          { // Sort the examples projects in alphabetical order
            examplProjs.sort(function (a, b) {
              return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            }).map(proj => {
              return this.helper(proj, false);
            })
          }
        </div>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={() => { this.handleClose(); this.handleQrToggle(); }}>
            <ListItemIcon >
              <Icon className="material-icons">gradient</Icon>
            </ListItemIcon>
            <ListItemText inset primary="QR Code" />
          </MenuItem>
          <MenuItem onClick={() => { this.handleClose(); this.handleShrToggle(); }}>
            <ListItemIcon >
              <Icon className="material-icons">send</Icon>
            </ListItemIcon>
            <ListItemText inset primary="Send" />
          </MenuItem>
          <MenuItem onClick={() => { this.handleClose(); this.handlePwToggle(); }}>
            <ListItemIcon >
              <Icon className="material-icons">lock</Icon>
            </ListItemIcon>
            <ListItemText inset primary="PW Protect" /></MenuItem>
        </Menu>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.qrCodeOpen}
          onClose={this.handleQrToggle} >
          <div style={getModalStyle()} className={classes.paper}>
            <this.qrCodeOpen />
          </div>
        </Modal>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.shareOpen}
          onClose={this.handleShrToggle} >
          <div style={getModalStyle()} className={classes.paper}>
            <this.shareOptions />
          </div>
        </Modal>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.pwProtectOpen}
          onClose={this.handlePwToggle} >
          <div style={getModalStyle()} className={classes.paper}>
            <this.pwProtect />
          </div>
        </Modal>
      </div>
    );
  }
}

const ProjectView = withStyles(modelStyles)(Project);

export default ProjectView;
