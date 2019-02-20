import * as React from 'react';
import { TextField, CircularProgress } from '@material-ui/core';
import { dataService } from '../../../core/services/data.service';
import { DialogTitle, DialogContent, DialogContentText, DialogActionButtons, Action } from '../Dialog';
import { DialogHandler } from '../../handlers/handler';
import Categories from '../Categories';
import { withRouter, Route, match } from 'react-router';
import { History, Location } from 'history';
import { CirclePicker , Color, ColorResult } from 'react-color';


class NewCategory extends React.Component<{ parentId?: string, history: History, location: Location, match: match }, any>  {
  actions: Action[];
  color: string = '#000';

  constructor(props: any)
  {
    super(props);
    this.state = { value: '', loading: false };
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
    if (this.state.value != '')
    {
      this.actions.map(action => action.isDisabled = true);
      this.setState({ loading: true });
      dataService.addCategory({name:this.state.value,color:this.color})
        .then(categoryId => 
        {
          DialogHandler.close();
          this.props.history.push('/קטגוריות/' + categoryId);
        })
        .finally(() =>
        {
          this.actions.map(action => action.isDisabled = false);
          this.setState({ loading: false });
        })
    }
  }
  colorPicked = (color: ColorResult) =>
  {
    this.color = color.hex;
  }
  public render()
  {
    return (
      <div className='NewCategory'>
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
          <CirclePicker onChangeComplete={this.colorPicked} />
        </DialogContent>
        <div>
          {this.state.loading && <CircularProgress size={24} className='Progress' />}
          <DialogActionButtons actions={this.actions} />
        </div>
      </div>
    );
  }
}

export default withRouter(NewCategory);
