import * as React from 'react';
import { Category, dataService } from '../../../core/services/data.service';
import { Toolbar,Fab, Typography, AppBar, Card, CardContent, Grid, CircularProgress } from '@material-ui/core';
import { withRouter, match } from 'react-router-dom';
import { History, Location } from 'history';
import { observer } from 'mobx-react';
import AddIcon from '@material-ui/icons/Add';
import { DialogHandler } from '../../handlers/handler';
import NewCategory from '../NewCategory';
import { CategoriesUrl } from '../../routes';
import { computed } from 'mobx';

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

  // parentCategory: Category = { name: '', level: -1, subCategories: [] };
  parentCategoryId = -1;
  categoriesLength=-1;

  constructor(props: WithRouterProps)
  {
    super(props);
   
    dataService.retrieveCategories();
  }
  @computed get categories()
  {
    const params = this.props.match.params;
    let categories:string[]=[];
    if (params.categoryId)
    {
      const parentCategory = dataService.getCategory(params.categoryId);
      if(parentCategory)
      {
      categories=parentCategory ? parentCategory.subCategories : [];
      this.categoriesLength=categories.length;
      }
    }
    else
    {
      categories= dataService.firstLevelCategories;
      this.categoriesLength=categories.length;
    }
    
    return categories;
  }
  
  @computed get parentCategory()
  {
    let category={ name: '', level: -1, subCategories: [''] };
    const params = this.props.match.params;
    if (params.categoryId)
    {
      category = dataService.getCategory(params.categoryId);
    }
    if(!category)
        category={ name: '', level: -1, subCategories: [''] };
    else
        this.categoriesLength=category.subCategories.length;
      
    return category;
  }

  private addNewCategory(parentCategoryId:string)
  {
    DialogHandler.open(NewCategory,{parentId:parentCategoryId});
  }
  private goToSubCategory(categoryNum:string)
  {
    this.props.history.push(CategoriesUrl+'/'+categoryNum);
  }
  public render()
  {
    const parentCategory=this.parentCategory;
    const parentCategoryLevel=parentCategory.level;
    const parentCategoryName = parentCategory.name;
    const categories=this.categories;
     const params = this.props.match.params;
    return (
      <div className='categories'>
        <AppBar style={{ position: 'relative' }} color='default'>
          <Toolbar >
            <Typography variant="h6" color="textSecondary" style={{ flex: 1 }}>
              {parentCategoryLevel != -1 ? parentCategoryName: 'קטגוריות'}
            </Typography>
          </Toolbar>
        </AppBar>
        {this.categoriesLength>0 && this.renderCategories(categories)}
         {(this.categoriesLength<0 && params.categoryId || this.categoriesLength ==0 && !params.categoryId)&& <div className='loading'><CircularProgress /></div>}
         {(this.categoriesLength==0  && params.categoryId) && <div>לא הגדרת תתי קטגוריות עדיין.
         <div> לחץ על ה+ להוספה</div></div>}
         <Fab  className='fab' onClick={()=>this.addNewCategory(params.categoryId)}><AddIcon/></Fab>
      </div>
    );
  }
  renderCategories = (categories:string[]) =>
  {
    return (
      <Grid container spacing={16} justify="center" alignItems="center" >
        <Grid item xs={12} md={8}>
          {
            categories.map(categoryNum =>
            {
              let category = dataService.getCategory(categoryNum);
              return (<Card key={categoryNum} className="categoryCard" onClick={()=>this.goToSubCategory(categoryNum)}>
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
