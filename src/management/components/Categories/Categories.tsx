import * as React from 'react';
import { Category, dataService, MaxCategoryLevel } from '../../core/services/data.service';
import
{
  Slide,
  Toolbar,
  Fab,
  Typography,
  AppBar,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  CircularProgress
} from '@material-ui/core';
import { withRouter, match } from 'react-router-dom';
import { History, Location } from 'history';
import { observer } from 'mobx-react';
import AddIcon from '@material-ui/icons/Add';
import { DialogHandler } from '../../handlers/handler';
import NewCategory from '../NewCategory';
import { CategoriesUrl } from '../../routes';
import { computed, observable } from 'mobx';
import chunk from 'lodash.chunk';

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

  // category: Category = { name: '', level: -1, subCategories: [] };
  categoryId = -1;
  categoriesLength = -1;
  isLoading: boolean | null = null;

  constructor(props: WithRouterProps)
  {
    super(props);

    dataService.retrieveCategories();
  }
  @computed get categories()
  {
    const params = this.props.match.params;
    let categories: string[] = [];
    if (params.categoryId)
    {
      const category = dataService.getCategory(params.categoryId);
      if (category)
      {
        categories = category ? category.subCategories : [];
        this.categoriesLength = categories.length;
      }
    }
    else
    {
      categories = dataService.firstLevelCategories;
      this.categoriesLength = categories.length;
    }
    if (this.isLoading == null && this.categoriesLength <= 0)
    {
      this.isLoading = true;
    }
    else
    {
      this.isLoading = false;
    }

    return chunk(categories, 2);
  }

  @computed get category()
  {
    let category = { name: '', level: -1, subCategories: [''] };
    const params = this.props.match.params;
    if (params.categoryId)
    {
      category = dataService.getCategory(params.categoryId);
    }
    if (!category)
      category = { name: '', level: -1, subCategories: [''] };
    else
      this.categoriesLength = category.subCategories.length;

    return category;
  }

  private addNewCategory(categoryId: string)
  {
    DialogHandler.open(NewCategory, { parentId: categoryId });
  }
  private goToSubCategory(categoryNum: string)
  {
    const category = dataService.getCategory(categoryNum);
    if (category.level < MaxCategoryLevel)
      this.props.history.push(CategoriesUrl + '/' + categoryNum);


  }
  public render()
  {
    const category = this.category;
    const categoryLevel = category.level;
    const categoryName = category.name;
    const categories = this.categories;
    const params = this.props.match.params;
    return (
        <div className='categories'>
          <AppBar style={{ position: 'relative' }} color='default'>
            {!this.isLoading && <Toolbar >
              <Typography variant="h6" color="textSecondary" style={{ flex: 1 }}>
                {categoryLevel != -1 ? categoryName : 'קטגוריות'}
              </Typography>
            </Toolbar>}
          </AppBar>
          {this.categoriesLength > 0 && this.renderCategories(categories)}
          {this.isLoading && <div className='middle'><CircularProgress /></div>}
          {(!this.isLoading && this.categoriesLength == 0 && params.categoryId) && <div className='middle'>לא הגדרת תתי קטגוריות עדיין.<div> לחץ על ה+ להוספה!</div></div>}
          {(!this.isLoading && this.categoriesLength == 0 && !params.categoryId) && <div className='middle'>לא הגדרת קטגוריות עדיין.<div> לחץ על ה+ להוספה!</div></div>}
          <Fab className='fab' onClick={() => this.addNewCategory(params.categoryId)}><AddIcon /></Fab>
        </div>
    );
  }
  renderCategories = (categories: string[][]) =>
  {
    return (
      <Grid container justify="center" alignItems="center" >
        {
          categories.map((categoryPair, index) =>
          {
            return (
              <Grid item xs={12} md={8} key={'pair' + index}>
                <Grid direction="row" container >
                  {
                    categoryPair.map((categoryNum, index, arr) =>
                    {
                      let category = dataService.getCategory(categoryNum);
                      return (<Grid item xs={12} md={arr.length == 2 ? 6 : 12} key={'item' + index + categoryNum}>
                        <Card className="categoryCard" onClick={() => this.goToSubCategory(categoryNum)}>
                          <CardActionArea className="categoryButton">
                            <CardContent>
                              {category && <Typography variant="h5" component="h2" style={{ color: category.color }}>
                                {category.name}
                              </Typography>}
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                      )
                    })
                  }
                </Grid>
              </Grid>);
          })
        }

      </Grid>
    );
  }
}

export default withRouter(Categories);
