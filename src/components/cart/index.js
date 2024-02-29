import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/header";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import {
  incrementAction,
  decrementAction,
  clearCartAction,
} from "@/store/slices/productSlice";
import { useRouter } from "next/navigation";
import cartLogo from "../../../public/image/logo/telezhka_pbuneqj5o42t_256.png";
import Image from "next/image";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { AddOutlined, PlusOne, RemoveOutlined } from "@mui/icons-material";

export default function Cart() {
  const data = useSelector((state) => state.usercart.userCart) || null;
  const [updatedData, setUpdatedData] = useState(data);
  const dispatch = useDispatch();
  const router = useRouter();

  const clickUpCount = (id) => {
    const updatedDataCopy = updatedData.map((item) => {
      if (item.id === id) {
        const newCount = item.count + 1;
        const total = item.price * newCount;
        return { ...item, count: newCount, totalPrice: total };
      }
      return item;
    });

    setUpdatedData(updatedDataCopy);
    dispatch(incrementAction(id, updatedDataCopy));
  };

  const clickDownCount = (id) => {
    const updatedDataCopy = updatedData.map((item) => {
      if (item.id === id) {
        const newCount = Math.max(item.count - 1, 0);
        const total = item.price * newCount;
        return { ...item, count: newCount, totalPrice: total };
      }
      return item;
    });

    setUpdatedData(updatedDataCopy);
    dispatch(decrementAction(id, updatedDataCopy));
  };

  const nextClick = () => {
    router.push("/order");
  };

  const clearCart = () => {
    dispatch(clearCartAction());
    setUpdatedData([]);
  };

  return (
    <>
      {data.length >= 1 ? (
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
        >
          <Button
            onClick={clearCart}
            sx={{ width: "100px", marginBottom: "10px" }}
            variant="contained"
            color="error"
          >
            Очистить
          </Button>
          <Box sx={{ overflow: "auto" }}>
            <Box className='dropdown__onmobile' sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="mobile__fs_10" >Название</TableCell>
                    <TableCell className="mobile__fs_10">Тип</TableCell>
                    <TableCell className="mobile__fs_10">Цена</TableCell>
                    <TableCell className="mobile__fs_10">Количество</TableCell>
                    <TableCell className="mobile__fs_10">Действия</TableCell>
                    <TableCell className="mobile__fs_10">Сумма</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody >
                  {updatedData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="mobile__fs_10">{item.name}</TableCell>
                      <TableCell className="mobile__fs_10">{item.type}</TableCell>
                      <TableCell className="mobile__fs_10">{item.price.toLocaleString()}₸</TableCell>
                      <TableCell className="mobile__fs_10" align="center">{item.count}</TableCell>
                      <TableCell className="mobile__fs_10">
                        <Button onClick={() => clickUpCount(item.id)}>
                          <AddOutlined />
                        </Button>
                        <Button onClick={() => clickDownCount(item.id)}>
                          <RemoveOutlined />
                        </Button>
                      </TableCell>
                      <TableCell className="mobile__fs_10">
                        {(item.price * item.count).toLocaleString()}₸
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
          <Button
            onClick={nextClick}
            sx={{ width: "100px", marginTop: "10px" }}
            variant="contained"
            color="primary"
          >
            Далее
          </Button>
        </Container>
      ) : (
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5",
          }}
        >
          <Image
            style={{ width: "50px", height: "50px" }}
            src={cartLogo}
            alt="cart logo"
          />
          <div>
            <div className="fs-2 mx-3">В корзине нет товаров</div>
          </div>
        </Container>
      )}
    </>
  );
}
