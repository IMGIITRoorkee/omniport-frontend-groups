import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Card, Icon, Grid, Segment } from "semantic-ui-react";

import { getTheme, getThemeObject } from "formula_one";
import PurposeCard from "./purpose-card";
import LocationCard from "./location-card";
import GroupPostList from "./group-post-list";
import { urlGroupTeam } from "../urls";

import "../css/group.css";

class GroupAbout extends React.Component {
  loadMore = () => {
    this.props.loadMore();
  };
  render() {
    const { activeGroup } = this.props;
    return (
      <Grid styleName="group-post-container" stackable>
        <Grid.Column width={5}>
          <PurposeCard heading="About" field="about" />
          <PurposeCard heading="Mission" field="mission" />
          <PurposeCard heading="Short description" field="shortDescription" />
          <LocationCard heading="Location" field="locationInformation" />
          <Link to={urlGroupTeam(activeGroup.data.slug)}>
            <Segment
              color={getTheme()}
              styleName="info-card-description-container"
            >
              <Icon name="user outline" color={getTheme()} />
              <span style={{ color: getThemeObject().hexCode }}>
                View members
              </span>
            </Segment>
          </Link>
        </Grid.Column>
        <GroupPostList loadMore={this.loadMore} />
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeGroup: state.activeGroup,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupAbout);
