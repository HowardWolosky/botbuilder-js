/**
 * @module botbuilder-planning
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity } from "botbuilder-core";
import { DialogCommand, DialogDependencies, TextPrompt, Dialog, DialogConfiguration, DialogContext, DialogTurnResult } from "botbuilder-dialogs";
import { TextSlotConfiguration } from "./textSlot";
import { ActivityProperty } from "../activityProperty";

export interface TextInputConfiguration extends DialogConfiguration, TextSlotConfiguration {

}

export class TextInput extends DialogCommand implements DialogDependencies {
    private textPrompt = new TextPrompt();

    constructor(property?: string, activity?: string|Partial<Activity>) {
        super();
        this.property = property;
        this.activity.value = activity;
    }

    protected onComputeID(): string {
        return `textInput[${this.bindingPath()}]`;
    }

    public getDependencies(): Dialog[] {
        // Update prompts ID before returning.
        this.textPrompt.id = this.id + ':prompt';
        return [this.textPrompt];
    }

    public configure(config: TextInputConfiguration): this {
        return super.configure(config);
    }

    /**
     * Activity to send the user.
     */
    public set prompt(value: string|Partial<Activity>) {
        this.activity.value = value;
    }

    public get prompt(): string|Partial<Activity> {
        return this.activity.value;
    }

    private activity = new ActivityProperty();

    /**
     * (Optional) data binds the called dialogs input & output to the given property.
     * 
     * @remarks
     * The bound properties current value will be passed to the called dialog as part of its 
     * options and will be accessible within the dialog via `dialog.options.value`. The result
     * returned from the called dialog will then be copied to the bound property.
     */
    public set property(value: string) {
        this.inputProperties['value'] = value;
        this.outputProperty = value;
    }

    public get property(): string {
       return this.outputProperty; 
    }

    public async onRunCommand(dc: DialogContext): Promise<DialogTurnResult> {
        // Check value and only call if missing
        const value = dc.state.getValue(this.property);
        if (typeof value !== 'string' || value.length == 0) {
            const activity = this.activity.format(dc, { utterance: dc.context.activity.text || '' });
            return await dc.prompt(this.textPrompt.id, activity);
        } else {
            return await dc.endDialog();
        }
    }
}