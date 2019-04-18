/**
 * @module botbuilder-planning
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { DialogTurnResult, DialogCommand, DialogContext, DialogConfiguration, DialogDebugEvents } from 'botbuilder-dialogs';

export interface CancelDialogConfiguration extends DialogConfiguration {
    eventName?: string;
    eventValue?: string;
    eventValueProperty?: string;
}

export class CancelDialog extends DialogCommand {

    constructor();
    constructor(eventName: string, eventValue?: string|object);
    constructor(eventName?: string, eventValue?: string|object) {
        super();
        this.eventName = eventName;
        if (typeof eventValue == 'string') {
            this.eventValueProperty = eventValue;
        } else {
            this.eventValue = eventValue
        }
    }
    
    protected onComputeID(): string {
        return `cancelDialog[${this.hashedLabel(this.eventName || '')}]`;
    }

    public eventName: string;

    public eventValue: object;

    public set eventValueProperty(value: string) {
        this.inputProperties['eventValue'] = value;
    }

    public get eventValueProperty(): string {
        return this.inputProperties['eventValue'];
    }

    public configure(config: CancelDialogConfiguration): this {
        return super.configure(config);
    }
    
    protected async onRunCommand(dc: DialogContext, options: object): Promise<DialogTurnResult> {
        dc.debugBreak(DialogDebugEvents.runStep);
        const opt = Object.assign({
            eventName: this.eventName,
            eventValue: this.eventValue
        }, options);
        return await dc.cancelAllDialogs(opt.eventName, opt.eventValue);
    }
}