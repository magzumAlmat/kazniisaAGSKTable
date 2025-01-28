// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Button, Container, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { getDocumentAction, deleteDocumentAction,createDocumentAction,getDocumentById } from "@/store/slices/productSlice";
// import { useTable } from "react-table";
// import { useDropzone } from "react-dropzone"; // Import the useDropzone hook

// export default function Pizzas() {
//   const dispatch = useDispatch();
//   const alldocuments = useSelector((state) => state.usercart.alldocuments);
//   console.log('this is allDocuments- ',alldocuments)
//   const [openDialog, setOpenDialog] = useState(false);
//   const [documentIdToDelete, setDocumentIdToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(getDocumentAction());
//   }, [dispatch]);

//   const handleDeleteClick = (id) => {
//     setDocumentIdToDelete(id); // Set the document ID to be deleted
//     setOpenDialog(true); // Open the dialog
//   };

//   const handleDownloadClick = (id) => {
//    console.log('id документа',id)
//   //  dispatch(getDocumentById(id))

//    alldocuments.map((docs)=>{
//     console.log('map documents',docs)
//     if (docs.id == id){
//       console.log('finded doc= ',docs)
//       let myUrl='http://localhost:8000/'+docs.path
//       console.log('my url= ',myUrl)

//       const link = document.createElement('a');
//       link.href = myUrl;
//       link.download = docs.name || 'file'; // Указываем имя файла, если оно есть в docs
//       document.body.appendChild(link); // Добавляем элемент в DOM
//       link.click(); // Программно нажимаем на ссылку
//       document.body.removeChild(link); // Удаляем элемент из DOM после скачивания
//     }
//    })

//   };
//   const handleConfirmDelete = () => {
//     dispatch(deleteDocumentAction(documentIdToDelete)); // Dispatch the delete action
//     setOpenDialog(false); // Close the dialog
//     setDocumentIdToDelete(null); // Reset the document ID
//   };

//   const handleCancelDelete = () => {
//     setOpenDialog(false); // Close the dialog without deleting
//     setDocumentIdToDelete(null); // Reset the document ID
//   };

//   const onDrop = (acceptedFiles) => {
//     // Only accept .docx files
//     const docxFiles = acceptedFiles.filter((file) => file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
//     if (docxFiles.length > 0) {
//       // Dispatch the upload action for the .docx files
//       console.log('1 ',docxFiles[0])
//       dispatch(createDocumentAction(docxFiles[0],docxFiles[0].name)); // You can handle multiple files if needed
//     } else {
//       alert("Please upload only .docx files.");
//     }
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: ".docx", // Only accept .docx files
//   });

//   const columns = useMemo(
//     () => [
//       {
//         Header: "ID",
//         accessor: "id",
//       },
//       {
//         Header: "Name",
//         accessor: "name",
//       },
//       // {
//       //   Header: "MIME Type",
//       //   accessor: "mimetype",
//       // },
//       // {
//       //   Header: "Path",
//       //   accessor: "path",
//       // },
//       {
//         Header: "Created At",
//         accessor: "createdAt",
//         Cell: ({ value }) => new Date(value).toLocaleString(),
//       },
//       // {
//       //   Header: "Updated At",
//       //   accessor: "updatedAt",
//       //   Cell: ({ value }) => new Date(value).toLocaleString(),
//       // },
//       {
//         Header: "Action",
//         accessor: "action",
//         Cell: ({ row }) => {
//           const { id } = row.original;
//           return (
//             <>
//             <Button
//               color="error"
//               variant="contained"
//               onClick={() => handleDeleteClick(id)}
//             >
//               Delete
//             </Button>
//             <Button
//             color="error"
//             variant="contained"
//             onClick={() => handleDownloadClick(id)}
//           >
//             Download
//           </Button>
//             </>
//           );
//         },
//       },

      
//     ],
//     []
//   );

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
//     columns,
//     data: alldocuments || [],
//   });

//   return (
//     <>
//       <Container>
//         <div className="home__display">
//           {/* You can add header or breadcrumb navigation here */}
//         </div>
//         <Divider className="mb-2" />

//         {/* Dropzone for file upload */}
//         <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: "20px", marginBottom: "20px" }}>
//           <input {...getInputProps()} />
//           <p>Drag and drop a .docx file here, or click to select a file</p>
//         </div>

//         <table {...getTableProps()} style={{ border: "solid 1px blue", width: "100%" }}>
//           <thead>
//             {headerGroups.map((headerGroup) => (
//               <tr {...headerGroup.getHeaderGroupProps()}>
//                 {headerGroup.headers.map((column) => (
//                   <th
//                     {...column.getHeaderProps()}
//                     style={{
//                       borderBottom: "solid 3px red",
//                       background: "aliceblue",
//                       color: "black",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {column.render("Header")}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody {...getTableBodyProps()}>
//             {rows.map((row) => {
//               prepareRow(row);
//               return (
//                 <tr {...row.getRowProps()}>
//                   {row.cells.map((cell) => (
//                     <td
//                       {...cell.getCellProps()}
//                       style={{
//                         padding: "10px",
//                         border: "solid 1px gray",
//                         background: "papayawhip",
//                       }}
//                     >
//                       {cell.render("Cell")}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </Container>

//       {/* Confirmation Dialog */}
//       <Dialog open={openDialog} onClose={handleCancelDelete}>
//         <DialogTitle>{"Delete Document?"}</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete this document? This action cannot be undone.
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancelDelete} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleConfirmDelete} color="error">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }



import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Divider, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { getDocumentAction, deleteDocumentAction, createDocumentAction } from "@/store/slices/productSlice";
import { useTable } from "react-table";
import { useDropzone } from "react-dropzone";

export default function Pizzas() {
  const dispatch = useDispatch();
  const alldocuments = useSelector((state) => state.usercart.alldocuments);
  const [openDialog, setOpenDialog] = useState(false);
  const [documentIdToDelete, setDocumentIdToDelete] = useState(null);

  // Пагинация и поиск
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 30; // Количество элементов на странице

  useEffect(() => {
    dispatch(getDocumentAction());
  }, [dispatch]);

  // Фильтрация данных по поисковому запросу
  const filteredDocuments = useMemo(() => {
    return alldocuments.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [alldocuments, searchQuery]);

  // Разделение данных на страницы
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDocuments, currentPage, itemsPerPage]);

  // Общее количество страниц
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  // Обработчики для пагинации
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Обработчик для поиска
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Сброс на первую страницу при изменении поискового запроса
  };

  // Остальные функции (handleDeleteClick, handleDownloadClick, onDrop и т.д.)
  const handleDeleteClick = (id) => {
    setDocumentIdToDelete(id);
    setOpenDialog(true);
  };

 

  const handleDownloadClick = (id) => {
   console.log('id документа',id)
  //  dispatch(getDocumentById(id))

   alldocuments.map((docs)=>{
    console.log('map documents',docs)
    if (docs.id == id){
      console.log('finded doc= ',docs)
      let myUrl='http://localhost:8000/'+docs.path
      console.log('my url= ',myUrl)

      const link = document.createElement('a');
      link.href = myUrl;
      link.download = docs.name || 'file'; // Указываем имя файла, если оно есть в docs
      document.body.appendChild(link); // Добавляем элемент в DOM
      link.click(); // Программно нажимаем на ссылку
      document.body.removeChild(link); // Удаляем элемент из DOM после скачивания
    }
   })

  };
  const handleConfirmDelete = () => {
    dispatch(deleteDocumentAction(documentIdToDelete)); // Dispatch the delete action
    setOpenDialog(false); // Close the dialog
    setDocumentIdToDelete(null); // Reset the document ID
  };

  const handleCancelDelete = () => {
    setOpenDialog(false); // Close the dialog without deleting
    setDocumentIdToDelete(null); // Reset the document ID
  };

  const onDrop = (acceptedFiles) => {
    const docxFiles = acceptedFiles.filter((file) => file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    if (docxFiles.length > 0) {
      dispatch(createDocumentAction(docxFiles[0], docxFiles[0].name));
    } else {
      alert("Please upload only .docx files.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".docx",
  });

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Created At", accessor: "createdAt", Cell: ({ value }) => new Date(value).toLocaleString() },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => {
          const { id } = row.original;
          return (
            <>
            <Button
              color="error"
              variant="contained"
              onClick={() => handleDeleteClick(id)}
            >
              Delete
            </Button>
            <Button
            color="error"
            variant="contained"
            onClick={() => handleDownloadClick(id)}
          >
            Download
          </Button>
            </>
          );
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: paginatedDocuments || [],
  });

  return (
    <>
      <Container>
        <div className="home__display">
          {/* Поле поиска */}
          <TextField
            label="Search by name"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            style={{ marginBottom: "20px" }}
          />

          {/* Dropzone для загрузки файлов */}
          <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: "20px", marginBottom: "20px" }}>
            <input {...getInputProps()} />
            <p>Drag and drop a .docx file here, or click to select a file</p>
          </div>

          {/* Таблица */}
          <table {...getTableProps()} style={{ border: "solid 1px blue", width: "100%" }}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} style={{ borderBottom: "solid 3px red", background: "aliceblue", color: "black", fontWeight: "bold" }}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} style={{ padding: "10px", border: "solid 1px gray", background: "papayawhip" }}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Пагинация */}
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
            <Button variant="contained" onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="contained" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      </Container>

      {/* Диалог подтверждения удаления */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>{"Delete Document?"}</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this document? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}