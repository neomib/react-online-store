import * as React from 'react';
import { Category, dataService } from '../../../core/services/data.service';
import { Toolbar, List, IconButton, Button, Typography, AppBar, withStyles, Card, CardContent } from '@material-ui/core';
import { withRouter, match } from 'react-router-dom';
import { History, Location } from 'history';

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};
class Categories extends React.Component<{ history: History, location: Location, match: match<any> }, any>  {

  categories: string[] = [];
  parentCategoryName: string = '';
  parentCategoryId: number = -1;
  componentWillMount()
  {
    const params = this.props.match.params;
    if (params.categoryId)
    {
      const parentCategory = dataService.getCategory(params.categoryId);
      this.parentCategoryName = parentCategory ? parentCategory.name : '';
      this.categories = parentCategory ? parentCategory.subCategories : [];
      this.parentCategoryId = params.categoryId;
    }
    else
    {
      this.categories = dataService.firstLevelCategories;
    }
  }
  handleClose()
  {

  }
  public render()
  {
    return (
      <div >
        <AppBar style={{ position: 'relative' }} color='default'>
          <Toolbar >
            <Typography variant="h6" color="textSecondary" style={{ flex: 1 }}>
              קטגוריות
            </Typography>
          </Toolbar>
        </AppBar>
        {this.parentCategoryName != '' && <Toolbar>
          <Typography variant="h4" color="inherit" style={{ flex: 1 }}>
            {this.parentCategoryName}
          </Typography>
        </Toolbar>}
        {this.renderCategories()}
      </div>
    );
  }
  renderCategories = () =>
  {
    return (
      <div>
        {
          this.categories.map(categoryNum =>
          {
            let category = dataService.getCategory(categoryNum);
            return (<Card key={categoryNum}>
              <CardContent>
                <Typography variant="h5" component="h2" color="textSecondary">
                  {category.name}
                </Typography>
              </CardContent>
            </Card>)
          })
        }
      </div>
    );
  }
}

export default withRouter(Categories);
