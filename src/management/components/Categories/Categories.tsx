import * as React from 'react';
import { Category, dataService } from '../../../core/services/data.service';
import { Toolbar, List, IconButton, Button, Typography, AppBar, withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};
class Categories extends React.Component<{ categoryId: string }, any>  {

  category: Category = { name: '', subCategories: [] };
  componentWillMount()
  {
    const { categoryId } = this.props;
    this.category = dataService.getCategory(categoryId);
  }
  handleClose()
  {

  }
  public render()
  {
    const { name: categoryName } = this.category;
    return (
      <div >
        <AppBar style={{ position: 'relative' }}>
          <Toolbar>
            <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
              {categoryName}
            </Typography>
          </Toolbar>
        </AppBar>
        <List>

        </List>
      </div>
    );
  }
}

export default Categories;
