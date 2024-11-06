import React, { useState } from "react";
import {
  createProductAction,
  getAllProductsAction,
} from "@/store/slices/productSlice";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { useRef } from "react";
import AllProduct from "../../components/allProducts/index";
import {
  Container,
  Typography,
  TextField,
  Button,
  TextareaAutosize,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import Image from "next/image";
import { FileUploadOutlined } from "@mui/icons-material";

const AddProductForm = ({ component, setComponent }) => {
  const [typeOfGood, setTypeOfGood] = useState("");
  const [mainType, setMainType] = useState("");
  const [type, setType] = useState("");
  const [name, setProductName] = useState("");
  const [price, setProductPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  // Словарь категорий
  const mainTypesByTypeOfGood = {
    "Продукты": [
      "Фрукты и овощи",
      "Молочные продукты",
      "Мясо и птица",
      "Рыба и морепродукты",
      "Замороженные продукты",
      "Бакалея",
    ],
    "Напитки": ["Минеральная вода", "Соки", "Газированные напитки"],
    "Бытовая химия": ["Моющие средства", "Чистящие средства"],
    "Товары для дома": ["Кухонные принадлежности", "Салфетки и бумага"],
  };

  const typesByMainType = {
    "Фрукты и овощи": ["Свежие фрукты", "Свежие овощи", "Ягоды", "Салатные наборы", "Зелень"],
    "Молочные продукты": ["Молоко", "Йогурты", "Сыры"],
    "Мясо и птица": ["Говядина", "Свинина", "Курица"],
    "Рыба и морепродукты": ["Свежая рыба", "Замороженная рыба", "Морепродукты"],
    "Замороженные продукты": ["Пельмени", "Овощные смеси", "Мороженое"],
    "Бакалея": ["Макароны", "Крупы", "Консервы"],
    "Минеральная вода": ["Газированная", "Негазированная"],
    "Соки": ["Фруктовые соки", "Овощные соки"],
    "Газированные напитки": ["Кола", "Лимонад"],
  };

  const handleFileChange1 = (acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    maxFiles: 10,
    onDrop: handleFileChange1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("typeOfGood", typeOfGood);
    formData.append("mainType", mainType);
    formData.append("type", type);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);

    selectedFiles.forEach((file) => {
      formData.append("image", file);
    });

    dispatch(createProductAction(formData));
    setTimeout(1000);
    dispatch(getAllProductsAction());

    setComponent("allProducts");
    setProductName("");
    setMainType("");
    setType("");
    setProductPrice("");
    setTypeOfGood("");
  };

  return (
    <Container>
      <Typography variant="h4">Добавление продукта</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="typeOfGood-label">Тип товара</InputLabel>
          <Select
            labelId="typeOfGood-label"
            value={typeOfGood}
            onChange={(e) => {
              setTypeOfGood(e.target.value);
              setMainType(""); // Сбросить выбранный основной тип
              setType(""); // Сбросить выбранную категорию
            }}
            required
          >
            {Object.keys(mainTypesByTypeOfGood).map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {typeOfGood && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="mainType-label">Основной тип</InputLabel>
            <Select
              labelId="mainType-label"
              value={mainType}
              onChange={(e) => {
                setMainType(e.target.value);
                setType(""); // Сбросить выбранную категорию
              }}
              required
            >
              {mainTypesByTypeOfGood[typeOfGood].map((mainTypeOption) => (
                <MenuItem key={mainTypeOption} value={mainTypeOption}>
                  {mainTypeOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {mainType && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="type-label">Категория</InputLabel>
            <Select
              labelId="type-label"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              {typesByMainType[mainType].map((typeOption) => (
                <MenuItem key={typeOption} value={typeOption}>
                  {typeOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          fullWidth
          margin="normal"
          label="Название продукта"
          value={name}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Цена продукта"
          value={price}
          onChange={(e) => setProductPrice(e.target.value)}
          required
        />
        <TextareaAutosize
          minRows={4}
          aria-label="maximum height"
          placeholder="Введите описание продукта"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            fontFamily: "Montserrat",
            marginTop: "10px",
          }}
          required
        />
        <div
          {...getRootProps()}
          style={{
            cursor: "pointer",
            padding: "20px",
            border: "2px dashed #ddd",
          }}
        >
          <input {...getInputProps()} ref={inputRef} style={{ display: "none" }} />
          <FileUploadOutlined sx={{ marginRight: "10px" }} />
          <span>Перетащите сюда файлы</span>
        </div>
        {selectedFiles.length > 0 && (
          <ul>
            {selectedFiles.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        )}

        <Button type="submit" variant="contained" color="primary">
          Добавить продукт
        </Button>
      </form>
    </Container>
  );
};

export default AddProductForm;
