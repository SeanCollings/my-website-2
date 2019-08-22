import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { updatePages } from '../../actions/appActions';
import MaterialTable from 'material-table';
import Loader from 'react-loader-advanced';

import TableLoading from './components/tableLoading';
import { MAINTENANCE_MENU } from '../../utils/maintenance';

import Grid from '@material-ui/core/Grid';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import green from '@material-ui/core/colors/green';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  disabledButton: {
    opacity: '0.3'
  },
  rootCheckbox: {
    color: green[600],
    '&$checked': {
      color: green[500]
    }
  },
  checked: {},
  rootInput: {
    padding: '0px',
    fontSize: '0.8125rem'
  }
});

const ITEM_HEIGHT = 48;

class UpdateApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateEnabled: false,
      anchorEl: null,
      screenType: MAINTENANCE_MENU.APP_SETTINGS.type,
      options: MAINTENANCE_MENU.APP_SETTINGS.options,
      selectedOption: MAINTENANCE_MENU.APP_SETTINGS.options[0],
      modifiedPages: [],
      showSpinner: false
    };
  }

  componentDidMount() {
    this.updatePages();
  }

  componentDidUpdate() {
    this.updatePages();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { pages } = nextProps.settings;
    const { modifiedPages } = nextState;

    if (pages.length === modifiedPages.length) {
      return false;
    }

    return true;
  }

  updatePages = () => {
    if (this.state.modifiedPages.length !== this.props.settings.pages.length) {
      this.setState({ modifiedPages: this.props.settings.pages });
    }
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = clickedOption => {
    const { options, selectedOption } = this.state;

    if (options.includes(clickedOption) && clickedOption !== selectedOption) {
      switch (clickedOption) {
        case MAINTENANCE_MENU.APP_SETTINGS.options[0]:
          this.setState({
            ...this.state
          });
          break;
        default:
          this.setState({
            ...this.state
          });
          break;
      }

      this.setState({ selectedOption: clickedOption });
    }
    this.setState({ anchorEl: null });
  };

  handdleChange = (e, togglePage) => {
    const { modifiedPages } = this.state;
    const { checked } = e.target;

    const newCheck = modifiedPages.map(page => {
      if (page.page === togglePage) {
        return { ...page, show: checked };
      }
      return page;
    });

    this.setState({ ...this.state, modifiedPages: newCheck });
  };

  staticPages = page => {
    const staticPages = ['Home', 'Maintenance'];
    if (staticPages.includes(page)) return true;
    return false;
  };

  renderPages = () => {
    const { classes } = this.props;
    const { modifiedPages } = this.state;

    return (
      <Grid
        container
        justify="center"
        direction="column"
        alignItems="center"
        style={{ paddingTop: '5px', paddingBottom: '5px' }}
      >
        {modifiedPages.map(page => {
          return (
            <Grid container justify="center" key={page.page}>
              <div>{`${page.page} | `}</div>
              <Checkbox
                disabled={this.staticPages(page.page) ? true : false}
                style={{
                  height: '0px',
                  opacity: this.staticPages(page.page) ? 0.4 : 1
                }}
                defaultChecked={page.show}
                onChange={e => this.handdleChange(e, page.page)}
                classes={{
                  root: classes.rootCheckbox,
                  checked: classes.checked
                }}
              />
            </Grid>
          );
        })}
        <Button
          size="small"
          onClick={() => this.props.updatePages(this.state.modifiedPages)}
          style={{
            color: 'white',
            backgroundColor: '#001f3f',
            marginTop: '5px',
            minWidth: '100px'
          }}
        >
          Update
        </Button>
      </Grid>
    );
  };

  renderSettings() {
    const { resizeScreen, settings } = this.props;

    const tableStyle = {
      width: '1px',
      whiteSpace: 'nowrap',
      padding: '0px',
      paddingRight: '10px'
    };

    const columns = [
      {
        title: 'Type',
        field: 'type',
        headerStyle: tableStyle,
        cellStyle: tableStyle
      }
    ];

    if (!resizeScreen) {
      columns.unshift({
        title: 'Row',
        field: 'index',
        headerStyle: tableStyle,
        cellStyle: tableStyle
      });
    }

    return (
      <div
        style={{
          paddingLeft: '10px',
          paddingRight: '10px',
          maxWidth: '1200px',
          margin: 'auto'
        }}
      >
        <Loader show={false}>
          <MaterialTable
            title="App Settings"
            columns={columns}
            data={
              settings.pages && settings.pages.length > 0
                ? [{ type: 'Pages' }]
                : []
            }
            detailPanel={[
              {
                render: rowData => {
                  return this.renderPages();
                }
              }
            ]}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
            options={{
              rowStyle: {
                height: 'auto'
              },
              headerStyle: {
                backgroundColor: '#5397bd',
                color: '#DEDEDE'
                // display: 'none'
              }
            }}
            components={
              this.state.showSpinner
                ? {
                    Body: props => <TableLoading />,
                    Header: props => (
                      <TableHead>
                        <TableRow style={{ backgroundColor: '#2980B9' }}>
                          <TableCell
                            style={{
                              paddingRight: '0px',
                              color: '#DEDEDE',
                              display: resizeScreen ? 'none' : ''
                            }}
                          >
                            Row
                          </TableCell>
                          <TableCell
                            style={{ paddingRight: '0px', color: '#DEDEDE' }}
                          >
                            Type
                          </TableCell>
                        </TableRow>
                      </TableHead>
                    )
                  }
                : null
            }
          />
        </Loader>
      </div>
    );
  }

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <Grid>
        <Grid
          item
          style={{
            textAlign: 'left',
            maxWidth: '100%',
            width: '100%',
            margin: 'auto'
          }}
        >
          <Grid
            item
            style={{
              textAlign: 'center'
            }}
          >
            <IconButton
              aria-label="More"
              aria-owns={open ? 'long-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleClick}
              style={{ color: '#DEDEDE', right: 0 }}
            >
              <MoreHorizIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={this.handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: 200
                }
              }}
            >
              {this.state.options.map(option => (
                <MenuItem
                  key={option}
                  selected={option === this.state.selectedOption}
                  onClick={() => this.handleClose(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
          {this.renderSettings()}
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps({ maintenance, resizeScreen, app }) {
  return { users: maintenance.users, resizeScreen, settings: app.settings };
}

export default connect(
  mapStateToProps,
  { ...actions, updatePages }
)(withStyles(styles)(UpdateApp));
