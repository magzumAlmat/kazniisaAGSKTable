import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Typography, Divider, TextField } from "@mui/material";
import Header from "@/components/header";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import {
  getAllProductsAction,
  addToCartProductAction,
  addClickCountReducer,
} from "@/store/slices/productSlice";
import Image from "next/image";
import { Search, Sort, SwapVertOutlined } from "@mui/icons-material";
import Link from "next/link";
import "rsuite/dist/rsuite-no-reset.min.css";
import { Carousel } from "rsuite";

export default function Pizzas() {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const crossOptical = useSelector((state) => state.usercart.allProducts);
  const host = useSelector((state) => state.usercart.host);
  const [sortState, setSortState] = useState("");

  const userCart = useSelector((state) => state.usercart.userCart);
  const selectedMainType = useSelector(
    (state) => state.usercart.selectedMainType
  );

  const selectedType = useSelector((state) => state.usercart.selectedType);

  const clickCount = useSelector((state) => state.usercart.clickCount);

  const isInCart = (item) => {
    return userCart.some((cartItem) => cartItem.id === item.id);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // console.log("Cross Optical", crossOptical);

  useEffect(() => {
    dispatch(getAllProductsAction());
  }, [crossOptical, dispatch]);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const buttonClick = (item) => {
    dispatch(addClickCountReducer());
    dispatch(addToCartProductAction(item));
  };

  const setActiveState = (number) => {
    if (sortState == "1") {
      setSortState("2");
    } else {
      setSortState(number);
    }
    // console.log(sortState);
  };

  const filteredMainType = crossOptical.filter((item) => {
    if (selectedMainType && selectedMainType !== "Все товары") {
      return item.mainType === selectedMainType;
    } else {
      return true;
    }
  });

  const filteredByType = selectedType
    ? filteredMainType.filter((item) => item.type === selectedType)
    : filteredMainType;

  const sortedProducts = filteredByType
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortState === "1") {
        return a.price - b.price;
      } else if (sortState === "2") {
        return b.price - a.price;
      }
      return 0;
    });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Calculate the indexes for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const url = "";
  const url2 = "";
  const url3 = "";
  const url4 = "";
  const url5 = "";

  return (
    <>
      <Container>
        <Typography variant="h4" className="pizza__title mb-3">
          {selectedMainType}
        </Typography>
        <div className="home__display">
          {/* <span> Главная </span>
          <span> / </span>
          <span> {selectedMainType} </span>
          <span> / </span>
          <span> {selectedType} </span> */}

          <span>
            <div className="home__display-between mb-3">
              {/* <input
                type="text"
                className="form-control"
                placeholder=" Поиск"
                value={searchTerm}
                onChange={handleSearchTermChange}
              /> */}
              <TextField
                label="Поиск"
                size="small"
                color="primary"
                focused
                onChange={handleSearchTermChange}
              />
              <div className="input-group-append">
                <Button
                  variant="outlined"
                  startIcon={<Search />}
                  sx={{ textTransform: "none" }}
                  size="normal"
                >
                  Найти
                </Button>
              </div>
            </div>
          </span>
        </div>
        <Divider className="mb-2" />
        <div className="pizza">
          {/* <Typography variant="h4" className="pizza__title mb-3">
            {selectedMainType}
          </Typography>

          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Поиск"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <div className="input-group-append">
              <Button
                variant="outlined"
                startIcon={<Search />}
                sx={{ textTransform: "none" }}
              >
                Найти
              </Button>
            </div>
          </div> */}

          <div className="sort__button">
            <Button
              onClick={() => setActiveState("1")}
              endIcon={<SwapVertOutlined />}
            >
              Сортировать по цене
            </Button>
          </div>

          <div className="pizza__body row">
            {currentItems.map((item, index) => (
              <div
                key={index}
                className="pizza__item d-flex flex-column gap-2 col-lg-3 justify-content-between"
              >
                <div className="pizza__item-start">
                  <Button className="pizza__img-button">
                    <Carousel className="custom-slider">
                      {item.image.split(",").map((imageUrl, imageIndex) => (
                        <img
                          key={imageIndex}
                          src={`${host + imageUrl.trim()}`}
                          alt={`Product image ${imageIndex}`}
                          style={{ objectFit: "contain", width: "100%" }}
                        />
                      ))}
                    </Carousel>
                  </Button>
                  <Typography variant="h6" className="pizza__item-title">
                    <Link href={`/product/${item.id}`}>
                      Наименование: {item.name}
                    </Link>
                  </Typography>

                  <Typography variant="body2" className="pizza__item-text">
                    Тип: {item.type}
                  </Typography>
                  <Typography variant="body2" className="pizza__item-text">
                    Описание:{item.description.slice(0, 100)}...
                  </Typography>
                </div>
                <div className="pizza__item-end align-items-center d-flex justify-content-between mt-2">
                  <Typography variant="body1" className="pizza__item-price">
                    {item.price.toLocaleString()} ₸
                  </Typography>

                  <Button
                    onClick={() => buttonClick(item)}
                    disabled={isInCart(item)}
                    variant="contained"
                    color="primary"
                  >
                    {isInCart(item) ? "Добавлено" : "В корзину"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="pagination" style={{'paddingLeft':'40%', 'marginTop':'5%'}}>
            <Button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              endIcon={<WestIcon />}
            >
             
            </Button>
            <span>{`Страница ${currentPage}`}</span>
            <Button
              disabled={indexOfLastItem >= sortedProducts.length}
              onClick={() => handlePageChange(currentPage + 1)}
              endIcon={<EastIcon />}
            >
              
            </Button>
          </div> */}
        <div
          className="pagination"
          style={{ paddingLeft: "40%", marginTop: "5%" }}
        >
          <Button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            endIcon={<WestIcon />}
          ></Button>
          <span>{`Страница ${currentPage} из ${totalPages}`}</span>
          <Button
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            endIcon={<EastIcon />}
          ></Button>
        </div>
      </Container>
    </>
  );
}

//TODO: поиск по заказам, фильтрация и сортировка
//TODO: сортировка/фильтрация и поиск
//TODO: slider
//TODO: корзину и оформление заказа как в леруа
//сделать jwt token или как-то оставлять авторизованным
