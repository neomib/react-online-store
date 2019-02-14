import * as React from 'react';
import { Grid, Typography, List, ListItem, Button } from '@material-ui/core';
import NewCategory from '../../components/NewCategory';
import { DialogHandler } from '../../handlers/handler';
import { dataService } from '../../../core/services/data.service';
import { withRouter, match, Route, Switch } from 'react-router-dom';
import { History, Location } from 'history';
import Categories from '../../components/Categories';

class Main extends React.Component<{ history: History, location: Location, match: match }, any>  {
  componentWillMount()
  {
    dataService.retrieveCategories();
  }
  addCategory = () =>
  {
    DialogHandler.open(NewCategory);
  }
  addItem = () =>
  {

  }
  goToCategories = () =>
  {
    this.props.history.push('/קטגוריות');
  }
  public render()
  {
    return (
      <div>
        <div id='Main'>
          <Grid container spacing={16} justify="center" alignItems="center" >
            <Grid item xs={12} md={8}>
              <div>
                <Button variant='contained'
                  className='orangeBtn largeBtn'
                  onClick={this.goToCategories}>קטגוריות</Button>
                <Button variant='contained'
                  className='blueBtn largeBtn'
                  onClick={this.addCategory}>הוסף קטגוריה</Button>
              </div>
            </Grid>
            {/* secon grid  */}
            <Grid item xs={12} md={8}>
              <div>
                <Button variant='contained'
                  className='greenBtn largeBtn'
                  onClick={this.addCategory}>הוסף תמונות לפריטים</Button>
                <Button variant='contained'
                  className='purpleBtn largeBtn'
                  onClick={this.addItem}>הוסף מבצעים</Button>
              </div>
            </Grid>
          </Grid>
        </div>
        {/* {this.renderCategoriesRoute()} */}
      </div>
    );
  }
}

export default withRouter(Main);
