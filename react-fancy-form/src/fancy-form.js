import React from 'react';
import { validatorsFunctions, checkFormContainErrors, createSlotFunctionsNames } from './form-index';

class FancyForm extends React.PureComponent {
    constructor(props) {
        super(props);
        const formKeys = Object.keys(props.initialValues);
        this.slots = createSlotFunctionsNames(props.settings, formKeys);
        this.state = {
            formKeys: formKeys,
            values: {...props.initialValues},
            errors: {},
            settings: {...props.settings},

            isFormDirty: false,
            isFormInvalid: false
        };
    }
    slots;
    
    componentDidUpdate = prevProps => {
        if (prevProps.initialValues !== this.props.initialValues) {
            this.detectInitialValuesChanges(this.props.initialValues);
        }
        if (prevProps.settings !== this.props.settings) {
            this.setState({settings: {...this.props.settings}});
        }
    }

    detectInitialValuesChanges = initialValues => {
        const values = {...initialValues, ...this.state.values};
        const formKeys = Object.keys(values);
        this.setState({values, formKeys});
    }

    handleChange = (e, key) => {
        const values = {...this.state.values};
        const errors = {...this.state.errors};
        values[key] = e.target.value;
        errors[key] = this.runSingleValidation(key, values[key]);

        if (this.state.isFormDirty) this.setState({ values, errors, isFormInvalid: checkFormContainErrors(errors) });
        else this.setState({values, errors});

        return errors[key];
    }

    runSingleValidation = (key, value) => {
        const { settings } = this.state;
        const { validators, label } = settings[key];
        for(let vk in validators) {
            const expectedVal = validators[vk];
            const error = validatorsFunctions[vk](value, expectedVal, label);
            if (error) return error;
        }
        return '';
    }

    runOnSubmitValidation = funcRef => {
        const { values, formKeys } = this.state;
        const errors = {...this.state.errors};
        let isFormInvalid = false;
        formKeys.forEach(key => {
            errors[key] = this.runSingleValidation(key, values[key]);
            if (errors[key]) {
                isFormInvalid = true;
            }
        });
        this.setState({errors, isFormInvalid, isFormDirty: true}, () => funcRef(isFormInvalid));
    }

    handleSubmit = (e, values) => {
        e.preventDefault();
        this.runOnSubmitValidation(isFormInvalid => {
            if (!isFormInvalid) {
                this.props.onSubmit(this.state.values);
            }
        });
    }

    render() {
        const { formKeys, values, errors, isFormInvalid, isFormDirty, settings } = this.state;
        return (
            <React.Fragment>
                {this.props.renderForm ? this.props.renderForm(formKeys, values, errors, isFormInvalid, isFormDirty, this.handleChange, this.handleSubmit) :
                <form onSubmit={this.handleSubmit}>
                    {formKeys.map(key => {
                        if (settings[key].needsSlot && this.props[this.slots[key]])
                            return this.props[this.slots[key]](key, values[key], errors[key], this.handleChange, this.handleSubmit);
                        
                        else {
                            return (
                                <section key={key}>
                                    <label>{settings[key].label}</label>
                                    <input type="text" value={values[key]}
                                        onChange={e => this.handleChange(e, key)}/>

                                    {errors[key] && <p style={{color: 'red'}}>{errors[key]}</p>}
                                </section>
                            );
                        }
                    })}

                    <button type="submit" disabled={isFormInvalid}>
                        Submit
                    </button>
                </form>
                }
            </React.Fragment>
        )
        
    }
}

export default FancyForm;