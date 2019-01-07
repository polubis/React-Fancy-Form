import React, { Component } from 'react';
import FancyForm from './fancy-form';

class InputSettings {
  constructor(label, validators, listData = [], needsSlot = false, component = 'input', componentProps = {className: 'field'}) {
    this.label = label;
    this.validators = validators;
    this.listData = listData;
    this.needsSlot = needsSlot;
    this.component = component;
    componentProps.placeholder = `type your ${label}...`;
    this.componentProps = componentProps;
  }
}

class App extends Component {
  state = {
    openRegisterForm: true,
    isLoading: false,
    initialValues: { username: '', email: '', password: 'agniecha', repeatedPassword: '', firstName: '', lastName: '' },
    settings: { 
      username: new InputSettings('Username', { required: true, minLength: 3, maxLength: 25 }, [], true ),
      email: new InputSettings('Email adress', { required: true, minLength: 3, maxLength: 25 } ),
      password: new InputSettings('Password', { required: true, minLength: 3, maxLength: 25 } ),
      repeatedPassword: new InputSettings('Repeated password', { required: true, minLength: 3, maxLength: 25 } ),
      firstName: new InputSettings('First name', { required: true, minLength: 3, maxLength: 25 } ),
      lastName: new InputSettings('Last name', { required: true, minLength: 3, maxLength: 25 } ),
    },
    settingsAdvanced: {
      username: new InputSettings('Username', { required: true, minLength: 3, maxLength: 25 }, [], true ),
      email: new InputSettings('Email adress', { required: true, minLength: 3, maxLength: 25 } ),
      password: new InputSettings('Password', { required: true, minLength: 3, maxLength: 25 }, ['agniecha', 'tomasz', 'piotr'], false, 'select'),
      repeatedPassword: new InputSettings('Repeated password', { required: true, minLength: 3, maxLength: 25 } ),
      firstName: new InputSettings('First name', { required: true, minLength: 3, maxLength: 25 } ),
      lastName: new InputSettings('Last name', { required: true, minLength: 3, maxLength: 25 } ),
    }
  }

  handleSubmit = formData => {
    console.log(formData);
  }

  typeAhead = value => {
    console.log(value);
    this.setState({isLoading: true});
    setTimeout(() => {
      const settings = {...this.state.settings};
      settings.username.listData = ['Pieski', 'Kotki', 'Inne takie takie'];
      this.setState({settings, isLoading: false});
    }, 1500);
  }

  render() {
    const { initialValues, settings, isLoading, settingsAdvanced, openRegisterForm } = this.state;
    return (
      <div className="App">
        {/* Fancy form z wykorzystaniem render propa - pozwala na tworzenie w bardziej dynamiczny sposob - uzywac tylko w zlozonych formularzach */}
        <FancyForm 
          onSubmit={this.handleSubmit}
          initialValues={initialValues} 
          settings={settings} 
          renderForm={(formKeys, values, errors, isFormInvalid, isFormDirty, handleChange, handleSubmit) => {
            return (
              <form onSubmit={handleSubmit}>
                {formKeys.map(key => {
                  return (
                    <div key={key}>
                      {settings[key].label}
                      <input type="text" value={values[key]} onChange={e => {
                        const isError = handleChange(e, key);
                        if (!isError && key === 'username') {
                          this.typeAhead(e.target.value)
                        }
                      }} />
                      <p style={{color: 'red'}}>{errors[key]}</p>
                      
                      {key === 'username' ?
                        isLoading ? <div>trwa ładowanie...</div> :
                        <ul>
                          {settings.username.listData.map(item => {
                            return <li key={item}>{item}</li>
                          })}
                        </ul>
                      : null}
                    </div>
                   
                  );
                })}
                <button disabled={isFormInvalid} type="submit">Submit z render propa</button>
              </form>
            );
          }}
        /> 
        <div style={{marginTop: '100px'}}></div>
        {/* Idealny do formow o srednim zaawansowaniu gdzie nie potrzebna jest zazdna dodatkowa logika */}

        {openRegisterForm && 
          <React.Fragment>
            <div className="modal">
              <div className="lab"/>
              <h3 className="modal-title">REGISTER</h3>
              <FancyForm 
                onSubmit={this.handleSubmit}
                initialValues={initialValues} 
                settings={settingsAdvanced} 
              />
            </div>
            <div className="backdrop" onClick={() => this.setState({openRegisterForm: false})}/>
        </React.Fragment>
        }
  

        <FancyForm
          key={3}
          onSubmit={this.handleSubmit}
          initialValues={initialValues} 
          settings={settings} 
          renderUsername={(key, value, error, handleChange, handleSubmit) => {
            return (
              <div key={key}>
                {settings[key].label}
                <input type="text" value={value} onChange={e => handleChange(e, key)} />

                <p>{error}</p>
              </div>
            );
          }}
        />
      </div>
    );
  }
}

export default App;
