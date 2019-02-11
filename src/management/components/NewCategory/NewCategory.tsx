import * as React from 'react';
import { TextField } from '@material-ui/core';
import { dataService } from '../../../core/services/data.service';
import { DialogTitle, DialogContent, DialogContentText, DialogActionButtons, Action } from '../Dialog';
import { DialogHandler } from '../../handlers/handler';
import Categories from '../Categories';

class NewCategory extends React.Component<any, any>  {
  actions: Action[];

  constructor(props: any)
  {
    super(props);
    this.state = { value: '' };
    this.actions = [
      { title: 'ביטול', click: DialogHandler.close },
      { title: 'הוסף', click: this.addCategory }
    ];
  }

  onValueChange = (event: any) =>
  {
    this.setState({ value: event.target.value });
  }
  addCategory = () =>
  {
    DialogHandler.close();
    if (this.state.value != '')
    {
      dataService.addCategory(this.state.value)
        .then(categoryId => DialogHandler.open(Categories, { categoryId }))
    }
  }
  public render()
  {
    return (
      <div >
        <DialogTitle>הוסף קטגוריה</DialogTitle>
        <DialogContent>
          <DialogContentText>
            הכנס את שם הקטגוריה שברצונך להוסיף
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            style={{ direction: 'rtl' }}
            label="שם הקטגוריה"
            fullWidth
            value={this.state.value}
            onChange={this.onValueChange}
          />
        </DialogContent>
        <DialogActionButtons actions={this.actions} />
      </div>
    );
  }
}

export default NewCategory;
