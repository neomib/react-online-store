import * as React from 'react';
import { Category, dataService } from '../../../core/services/data.service';
import { Toolbar,Fab, Typography, AppBar, Card, CardContent, Grid } from '@material-ui/core';
import { withRouter, match } from 'react-router-dom';
import { History, Location } from 'history';
import { observer } from 'mobx-react';
import AddIcon from '@material-ui/icons/Add';

interface WithRouterProps
{
  history: History,
  location: Location,
  match: match<any>
}
const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};
@observer
class Categories extends React.Component<WithRouterProps, any>  {

  parentCategory: Category = { name: '', level: -1, subCategories: [] };
  parentCategoryId = -1;

  constructor(props: WithRouterProps)
  {
    super(props);
    const params = this.props.match.params;
    if (params.categoryId)
    {
      this.parentCategory = dataService.getCategory(params.categoryId);
    }
    dataService.retrieveCategories();
  }
  get categories()
  {
    const params = this.props.match.params;
    if (params.categoryId)
    {
      const parentCategory = dataService.getCategory(params.categoryId);
      return parentCategory ? parentCategory.subCategories : [];
    }
    else
    {
      return dataService.firstLevelCategories;
    }
  }
  public render()
  {
    const parentCategoryName = this.parentCategory.name;
    return (
      <div className='categories'>
        <AppBar style={{ position: 'relative' }} color='default'>
          <Toolbar >
            <Typography variant="h6" color="textSecondary" style={{ flex: 1 }}>
              קטגוריות
            </Typography>
          </Toolbar>
        </AppBar>
        {parentCategoryName != '' && <Toolbar>
          <Typography variant="h4" color="inherit" style={{ flex: 1 }}>
            {parentCategoryName}
          </Typography>
        </Toolbar>}
        {this.renderCategories()}
         <Fab  className='fab'><AddIcon/></Fab>
      </div>
    );
  }
  renderCategories = () =>
  {
    return (
      <Grid container spacing={16} justify="center" alignItems="center" >
        <Grid item xs={12} md={8}>
          {
            this.categories.map(categoryNum =>
            {
              let category = dataService.getCategory(categoryNum);
              return (<Card key={categoryNum} className="categoryCard">
                <CardContent>
                  <Typography variant="h5" component="h2" style={{ color: category.color }}>
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>)
            })
          }
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(Categories);
