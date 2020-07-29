import React, { useEffect, useState } from 'react';
import Pagination from './Pagination'

const PaginationContainer = (props) => {

  const [pages, setPages] = useState(props.total < props.itemsPerPage ? 1 : Math.ceil((props.total / props.itemsPerPage)))
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState(props.data)

  useEffect(() => {
    setData(props.data)
  }, [props.data])

  const updateCurrentPage = (i) => {
    let pageToGo = currentPage + i;
    let _currentPage = ((pageToGo <= 0) || (pageToGo > pages)) ? currentPage : pageToGo;
    setCurrentPage(_currentPage)
  }

  const goToPage = (page) => {
    setCurrentPage(page)
    getData((page - 1) * props.itemsPerPage)
  }

  const getData = (skip) => {
    return props.getCurrentPageData(skip)
  }

  const { children } = props;
  const childrenWithProps = React.Children.map(children, child =>
    React.cloneElement(child, { data: data })
  );

  return(
    <div>
      {childrenWithProps}
      <Pagination 
        currentPage = {currentPage}
        pages = {pages}
        updateCurrentPage = {updateCurrentPage}
        goToPage = {goToPage}
      />
    </div>
  );
}

export default PaginationContainer;