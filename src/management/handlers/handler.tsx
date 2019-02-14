import React from 'react';
import { Dialog, DialogType } from '../components/Dialog';

export let DialogHandler: DialogType;

export class Handlers extends React.Component<any,any>
{
    render()
    {
        return [
            <Dialog key="dialog" onRef={(ref: DialogType) => DialogHandler = ref} />
        ]
    }
}
