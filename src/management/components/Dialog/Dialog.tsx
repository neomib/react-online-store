import * as React from 'react';
import { Dialog as DialogUI, DialogTitle as DialogTitleUI, DialogContent as DialogContentUI, DialogActions, Button, PropTypes, withMobileDialog, DialogContentText as DialogContentTextUI } from '@material-ui/core';

export interface Action
{
  title: string;
  click(): void;
  color?: PropTypes.Color
}

export interface DialogProps
{
  onRef: (ref: DialogComp | null) => void,
  fullScreen?: boolean,
}

class DialogComp extends React.Component<DialogProps, any>  {

  Comp: React.ComponentType<any> = () => { return null };
  compProps:any={};

  constructor(props: DialogProps)
  {
    super(props);
    this.state = { isOpen: false };
  }
  componentWillMount()
  {
    if (this.props.onRef)
      this.props.onRef(this);
  }
  componentWillUnmount()
  {
    if (this.props.onRef)
      this.props.onRef(null);
  }
  open(Comp: React.ComponentType<any>,compProps?:any)
  {
    this.Comp = Comp;
    this.compProps=compProps;
    this.setState({ isOpen: true });
  }
  close = () =>
  {
    this.setState({ isOpen: false });
  }
  // actionClick(action: Action)
  // {
  //   if (action.onClick)
  //     action.onClick();
  //   this.close();
  // }
  public render()
  {
    return (
      <div >
        <DialogUI open={this.state.isOpen}
          onClose={this.close}
          aria-labelledby="form-dialog-title"
          fullScreen={this.props.fullScreen}>
          {this.Comp && <this.Comp {...this.compProps}/>}
        </DialogUI>
      </div>
    );
  }
}
export const Dialog = withMobileDialog()(DialogComp);
export type DialogType = DialogComp;
export const DialogTitle = (props: React.ComponentProps<any>) =>
{
  return <DialogTitleUI>{props.children}</DialogTitleUI>
}
export const DialogContent = (props: any) =>
{
  return <DialogContentUI>{props.children}</DialogContentUI>
}
export const DialogContentText = (props: React.ComponentProps<any>) =>
{
  return <DialogContentTextUI>{props.children}</DialogContentTextUI>
}

export const DialogActionButtons = ({ actions }: { actions: Action[] }) =>
{
  return (<DialogActions>
    {
      actions.map((action,index) =>
      {
        return (<Button key={index} onClick={action.click} color={action.color || "primary"}>
          {action.title}
        </Button>)
      })
    }
  </DialogActions>);
}
