import * as React from 'react';
import { Items, Item } from '../../core/entities';
import { dataService } from '../../core/services/data.service';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import AddIcon from '@material-ui/icons/Add';
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
  CircularProgress,
  Divider,
  Button
} from '@material-ui/core';
import chunk from 'lodash.chunk';

interface ItemListProps
{
  categoryId: string;
}
@observer @observer
class ItemsList extends React.Component<ItemListProps, any>  {

  @observable private itemsList: Item[] = [];
  itemPairs:Array<Item[]>=[];
  itemsLength = -1;
  isLoading: boolean | null = null;


  constructor(props: ItemListProps)
  {
    super(props);
    dataService.retrieveItems(this.props.categoryId,
      items =>
      {
        this.itemsList = Object.values(items);
        this.itemsLength = this.itemsList.length;
        this.itemPairs=chunk(this.itemsList, 2);
        if (this.isLoading == null && this.itemsLength <= 0)
        {
          this.isLoading = true;
        }
        else
        {
          this.isLoading = false;
        }
      });

  }
  addNewItem()
  {
    
  }

  public render()
  {
    const category = dataService.getCategory(this.props.categoryId);
    return (
      <div className='items'>
        <AppBar style={{ position: 'relative' }} color='default'>
          {!this.isLoading && <Toolbar >
            <Typography variant="h6" color="textSecondary" style={{ flex: 1 }}>
              {category.name}
            </Typography>
          </Toolbar>}
        </AppBar>
        {this.itemsLength > 0 && this.renderItems()}
        {this.isLoading && <div className='middle'><CircularProgress /></div>}
        {!this.isLoading && this.itemsLength == 0 && <div className='middle'>לא נמצאו פריטים.<div> לחץ על ה+ להוספה!</div></div>}
        <Fab className='fab' onClick={() => this.addNewItem()}><AddIcon /></Fab>
      </div>
    );
  }
  public renderItems()
  {
    return (
      <Grid container justify="center" alignItems="center" >
        {
          this.itemPairs.map((itemPair, index) =>
          {
            return (
              <Grid item xs={12} md={8} key={'pair' + index}>
                <Grid direction="row" container >
                  {
                    itemPair.map((itemNum, index, arr) =>
                    {
                      
                      return (<Grid item xs={12} md={arr.length == 2 ? 6 : 12} key={'item' + index + itemNum} >
                        {/* <Card className="categoryCard" onClick={() => this.goToSubCategory(itemNum)}>
                          <div>
                            <CardActionArea className="categoryButton">
                              <CardContent style={{ padding: '16px 5px 6px' }}>
                                {category && <Typography variant="h4" style={{ color: category.color }}>
                                  {category.name}
                                </Typography>}
                                {
                                  category && <p style={{ color: '#bfbfbf', fontSize: 'medium', margin: '10px 0' }}>
                                    {
                                      dataService.getSubCategories(itemNum).length > 0 ?
                                        dataService.getSubCategories(itemNum).map((subCategoryId, index, arr) =>
                                        {
                                          let subCategory = dataService.getCategory(subCategoryId);
                                          return subCategory.name + (index === arr.length - 1 ? '' : ',')
                                        }) :
                                        'ללא תתי קטגוריה'
                                    }
                                  </p>
                                }
                              </CardContent>
                            </CardActionArea>
                          </div>
                          <Divider variant="middle" />
                          <div>
                            <CardContent style={{ paddingBottom: '10px' }}>
                              <Button size={'small'} style={{ color: '#6cadb5' }}><AddIcon fontSize={'small'} /> הוסף</Button>
                              <Button size={'small'} style={{ color: '#6cadb5' }}> <EditIcon fontSize={'small'} /> ערוך</Button>
                              <Button size={'small'} style={{ color: '#6cadb5' }}><DeleteIcon fontSize={'small'} onClick={(e) => this.deleteCategory(itemNum, e)} /> מחק</Button>
                            </CardContent>
                          </div>
                        </Card> */}
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

export default ItemsList;
