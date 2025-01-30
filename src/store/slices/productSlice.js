import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  alldocuments: [],
  error: null,
  userCart: [],
  allProducts: [],
  allOrders: [],
  isAuth: false,
  order: {},
  editedOrder: {},
  editedProduct: null,
  selectedMainType: "Все товары",
  selectedType: "",
  clickCount: 0,
  loading: false,
  host: "http://localhost:8000/",
};

export const userPostsSlice = createSlice({
  name: "usercart",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    addClickCountReducer: (state) => {
      state.clickCount += 1;
    },
    deleteClickCountReducer: (state) => {
      state.clickCount -= 1;
    },
    
    getAllOrdersReducer: (state, action) => {
      const existingOrders = state.allOrders.map((order) => order.id);
      const newOrders = action.payload.filter(
        (newOrder) => !existingOrders.includes(newOrder.id)
      );
      state.allOrders.push(...newOrders);
    },
    getAllProductsReducer: (state, action) => {
      const existingProducts = state.allProducts.map((product) => product.id);
      const newProducts = action.payload.filter(
        (newProduct) => !existingProducts.includes(newProduct.id)
      );
      state.allProducts.push(...newProducts);
    },
    getAllDocumentReducer: (state, action) => {
      state.alldocuments = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
    },
    filterAllProductsReducer: (state, action) => {
      state.allProducts = action.payload;
    },
    getOrderReducer: (state, action) => {
      state.order = action.payload;
    },
    getProductByIdReducer: (state, action) => {
      state.editedProduct = action.payload[0];
    },
    isAuthReducer: (state, action) => {
      state.isAuth = action.payload;
    },
    createDocumentReducer: (state, action) => {
      state.allProducts = [...state.alldocuments, action.payload];
    },
    editOrderReducer: (state, action) => {
      state.editedOrder = action.payload;
    },
    editProductReducer: (state, action) => {
      const index = state.allProducts.findIndex(
        (product) => product.id === state.editedProduct.id
      );
      if (index !== -1) {
        state.allProducts[index] = state.editedProduct;
      }
      state.selectedMainType = "Все товары";
    },
    deleteProductReducer: (state, action) => {
      state.allProducts = state.allProducts.filter(
        (item) => item.id !== action.payload
      );
      state.selectedMainType = "Все товары";
    },
    deleteDocumentReducer: (state, action) => {
      state.alldocuments = state.alldocuments.filter(
        (item) => item.id !== action.payload
      );
    },
    setSelectedMainTypeReducer: (state, action) => {
      state.selectedMainType = action.payload;
    },
    setSelectedTypeReducer: (state, action) => {
      state.selectedType = action.payload;
    },
    clearCartAction: (state) => {
      state.userCart = [];
    },
  },
});

export const {
  addDataToUser ,
  updateUser ,
  getAllOrdersReducer,
  clearCartAction,
  getAllProductsReducer,
  isAuthReducer,
  getOrderReducer,
  editOrderReducer,
  editProductReducer,
  deleteProductReducer,
  filterAllProductsReducer,
  setSelectedMainTypeReducer,
  setSelectedTypeReducer,
  addClickCountReducer,
  deleteClickCountReducer,
  getProductByIdReducer,
  createDocumentReducer,
  deleteDocumentReducer,
  getAllDocumentReducer,
} = userPostsSlice.actions;

const host = "http://localhost:8000/";

export const getDocumentAction = () => async (dispatch) => {
  try {
    const response = await axios.get(`${host}files`);
    dispatch(getAllDocumentReducer(response.data));
  } catch (error) {
    console.error("Error fetching documents:", error);
    dispatch(setError(error.message));
  }
};

export const createDocumentAction = (file, name) => async (dispatch) => {
  const formData = new FormData();
  const blob = new Blob([file], { type: file.type });
  formData.append("file", blob, file.name);
  formData.append("name", name);

  try {
    const response = await axios.post(`${host}upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(createDocumentReducer(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const deleteDocumentAction = (documentId) => async (dispatch) => {
  try {
    await axios.delete(`${host}files/${documentId}`);
    dispatch(deleteDocumentReducer(documentId));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default userPostsSlice.reducer;