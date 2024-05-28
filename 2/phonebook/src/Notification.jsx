import React from 'react';

const Notification = (props) => {
    if (props.successMsg !== null) {
        return (
            <div className='success'>
                  {props.successMsg}
            </div>
        )
    }

    if (props.errorMsg !== null) {
        return (
            <div className='error'>
              {props.errorMsg}
            </div>
          )
    }
}

export default Notification;