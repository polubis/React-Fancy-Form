import React from 'react';

const Input = ({type, ...rest}) => <input {...rest} type={type} />;

Input.defaultProps = {
    type: 'text'
};

export default Input;