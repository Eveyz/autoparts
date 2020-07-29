import React from 'react';
// import Spinner from '../images/loading.svg';

const Loading = props => (
  // <div className="container center">
  //   <img src={Spinner} alt="loading..."></img>
  //   <h4>正在加载数据...</h4>
  // </div>
  <div>
    <br/>
    <div className="progress">
      <div className="indeterminate"></div>
    </div>
    <h3 className="center">加载中...</h3>
  </div>
)

export default Loading;
