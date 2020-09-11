import React from "react";
import { connect } from "react-redux";
import { Route, Redirect, Switch } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";

import GroupList from "./group-list";
import GroupDetail from "./group-detail";
import GroupTeam from "./group-team";
import { setGroupList, getMorePost, getMoreTeam } from "../actions";

import main from "formula_one/src/css/app.css";

class App extends React.PureComponent {
  handleScroll = (values) => {
    let part = window.location.href.split("/");
    const lastSegment = part.pop() || part.pop();
    const { activeGroupPost, activeGroup, groupTeam } = this.props;
    if (`\\${lastSegment}\\` !== this.props.match.path) {
      if (lastSegment === "team") {
        if (groupTeam.isLoaded && activeGroup.isLoaded) {
          if (
            (values === true ||
              (1 - values.top) * values.scrollHeight <= 800) &&
            groupTeam.team.next
          ) {
            this.props.GetMoreTeam(groupTeam.team.next);
          }
        }
      } else {
        if (activeGroupPost.isLoaded && activeGroup.isLoaded) {
          if (
            (values === true ||
              (1 - values.top) * values.scrollHeight <= 800) &&
            activeGroupPost.post.next
          ) {
            this.props.GetMorePost(
              activeGroup.data.slug,
              activeGroupPost.post.next
            );
          }
        }
      }
    }
  };
  render() {
    const { match } = this.props;
    return (
      <Scrollbars autoHide onScrollFrame={this.handleScroll}>
        <Switch>
          <Route exact path={`${match.path}`} component={GroupList} />
          <Route
            exact
            path={`${match.path}:slug`}
            render={(props) => (
              <GroupDetail {...props} handleScroll={this.handleScroll} />
            )}
          />
          <Route
            exact
            path={`${match.path}:slug/team`}
            render={(props) => (
              <GroupTeam {...props} handleScroll={this.handleScroll} />
            )}
          />
          <Route render={(props) => <Redirect to="/404" />} />
        </Switch>
      </Scrollbars>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeGroupPost: state.activeGroupPost,
    activeGroup: state.activeGroup,
    groupTeam: state.groupTeam,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    SetGroupList: () => {
      dispatch(setGroupList());
    },
    GetMorePost: (slug, page) => {
      dispatch(getMorePost(slug, page));
    },
    GetMoreTeam: (page) => {
      dispatch(getMoreTeam(page));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
