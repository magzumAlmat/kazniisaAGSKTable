import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { getDocumentAction, deleteDocumentAction, createDocumentAction } from "@/store/slices/productSlice";
import { useTable } from "react-table";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

// Styled components
const StyledDropzone = styled("div")(({ theme }) => ({
  border: "2px dashed #1976D2",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  backgroundColor: "#f0f4f8",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#e0eaf2",
  },
}));

const StyledTable = styled("table")(({ theme }) => ({
  width: "100%",
  borderCollapse: "collapse",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
  overflow: "hidden",
}));

const StyledTableHeader = styled("th")(({ theme }) => ({
  backgroundColor: "#1976D2",
  color: "#fff",
  padding: "12px",
  textAlign: "left",
}));

const StyledTableRow = styled("tr")(({ theme }) => ({
  backgroundColor: "#fff",
  "&:nth-of-type(even)": {
    backgroundColor: "#f9f9f9",
  },
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
}));

const StyledTableCell = styled("td")(({ theme }) => ({
  padding: "12px",
  borderBottom: "1px solid #ddd",
}));

const PaginationContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  marginTop: "20px",
}));


function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}


export default function Pizzas() {
  const dispatch = useDispatch();

  const [openDialog, setOpenDialog] = useState(false);
  const [documentIdToDelete, setDocumentIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 3;
  const [isLoading, setIsLoading] = useState(true);
 
  const { alldocuments, loading, error, host } = useSelector((state) => state.usercart);

  // Filter documents based on search query
  const filteredDocuments = useMemo(() => {
    return alldocuments.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [alldocuments, searchQuery]);

  // Paginate documents
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDocuments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDocuments, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() =>
    Math.ceil(filteredDocuments.length / itemsPerPage),
    [filteredDocuments, itemsPerPage]
  );

  // Handle pagination
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

  // Handle search input change
  const handleSearchChange = (event) => {
    const newQuery = event.target.value;
    if (newQuery !== searchQuery) {
      setSearchQuery(newQuery);
      setCurrentPage(1);
    }
  };

  // Handle delete confirmation dialog
  const handleDeleteClick = (id) => {
    setDocumentIdToDelete(id);
    setOpenDialog(true);
  };

  // Fetch documents on component mount
 
  useEffect(() => {
    dispatch(getDocumentAction());
  }, [dispatch]);

  // Handle document deletion
  const handleConfirmDelete = () => {
    dispatch(deleteDocumentAction(documentIdToDelete));
    setOpenDialog(false);
    setDocumentIdToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setDocumentIdToDelete(null);
  };

  // Handle file upload
  const onDrop = (acceptedFiles) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/pdf",
      "image/vnd.djvu",
      "image/x-djvu",
    ];
    const validFiles = acceptedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (validFiles.length > 0) {
      dispatch(createDocumentAction(validFiles[0], validFiles[0].name));
    } else {
      alert("Please upload only .docx, .doc, .pdf, or .djvu files.");
    }
  };


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
      "application/pdf": [".pdf"],
      "image/vnd.djvu": [".djvu"],
      "image/x-djvu": [".djvu"],
    },
  });

  // Handle document download
  const handleDownloadClick =  async(id) => {
    const docToDownload = alldocuments.find((doc) => doc.id == id);

            if (!docToDownload) {
              console.error(`Document with ID ${id} not found.`);
              return;
            }
        
            try {
              const downloadUrl = `http://localhost:8000/${docToDownload.path}`;
              const response = await fetch(downloadUrl);
        
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
        
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", docToDownload.name || "file");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            } catch (error) {
              console.error("Error downloading file:", error);
              setError("Failed to download file");
            }
  };

  // Table columns
  // const columns = useMemo(() => [
  //   { Header: "Name", accessor: "name" },
  //   { Header: "MIME Type", accessor: "mimetype" },
  //   { Header: "Created At", accessor: "createdAt", 
  //     Cell: ({ value }) => new Date(value).toLocaleString() 
  //   },
  //   {
  //     Header: "Action",
  //     accessor: "action",
  //     Cell: ({ row }) => {
  //       const { id } = row.original;
  //       return (
  //         <>
  //           <Button 
  //             variant="contained" 
  //             color="error" 
  //             onClick={() => handleDeleteClick(id)} 
  //             style={{ marginRight: "10px" }}
  //           >
  //             Delete
  //           </Button>
  //           <Button 
  //             variant="contained" 
  //             color="primary" 
  //             onClick={() => handleDownloadClick(id)}
  //           >
  //             Download
  //           </Button>
  //         </>
  //       );
  //     },
  //   },
  // ], []);

  // Table data
  // const tableData = useMemo(
  //   () => paginatedDocuments,
  //   [paginatedDocuments]
  // );

  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
  //   columns,
  //   data: tableData,
  // });

  // Loading state
  // if (isLoading) {
  //   return <CircularProgress />;
  // }

  // Error state
  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  // No documents state
  if (!alldocuments || alldocuments.length === 0) {
    return (
      <Container maxWidth="lg" style={{ padding: "20px" }}>
        <Typography>No documents available.</Typography>
        <StyledDropzone {...getRootProps()}>
          <input {...getInputProps()} />
          <CloudUploadIcon style={{ fontSize: "48px", color: "#1976D2" }} />
          <Typography variant="body1" style={{ marginTop: "10px" }}>
            Drag and drop a file here, or click to select a file
          </Typography>
        </StyledDropzone>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom style={{ color: "#1976D2", marginBottom: "20px" }}>
        Document Manager
      </Typography>

      <TextField
        label="Search by name"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        style={{ marginBottom: "20px" }}
      />

      <StyledDropzone {...getRootProps()}>
        <input {...getInputProps()} />
        <CloudUploadIcon style={{ fontSize: "48px", color: "#1976D2" }} />
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          Drag and drop a .docx file here, or click to select a file
        </Typography>
      </StyledDropzone>

      {/* <StyledTable {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <StyledTableHeader {...column.getHeaderProps()}>{column.render('Header')}</StyledTableHeader>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <StyledTableRow {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <StyledTableCell {...cell.getCellProps()}>{cell.render('Cell')}</StyledTableCell>
                ))}
              </StyledTableRow>
            );
          })}
        </tbody>
      </StyledTable> */}

  





      {/* {alldocuments.length === 0 ? (
        <p>Нет доступных документов</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Скачать</th>
            </tr>
          </thead>
          <tbody>
            {alldocuments.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.name}</td>
                <td>
                  <button onClick={() => handleDownloadClick(doc.id)}>Скачать</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )} */}







<TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">action&nbsp;(g)</TableCell>
          
          </TableRow>
        </TableHead>
        <TableBody>
          {alldocuments.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.mimetype}</TableCell>

              <TableCell align="right"> <button onClick={() => handleDownloadClick(row.id)}>Скачать</button>
              <Button 
              variant="contained" 
              color="error" 
              onClick={() => handleDeleteClick(row.id)} 
              // style={{ marginRight: "10px" }}
            >
              Delete
            </Button>
              </TableCell>

            
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>



    <PaginationContainer>
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
        <Typography>{currentPage} of {totalPages}</Typography>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
      </PaginationContainer>

      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this document?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>


    </Container>
  );
}









// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useState,useMemo } from "react";
// import { getDocumentAction } from "../../store/slices/productSlice";
// import { useDropzone } from "react-dropzone";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { styled } from "@mui/system";
// import {
//   Button,
//   Container,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// const DocumentList = () => {
 
// // Styled components
// // // Styled components
// const StyledDropzone = styled("div")(({ theme }) => ({
//   border: "2px dashed #1976D2",
//   borderRadius: "10px",
//   padding: "20px",
//   textAlign: "center",
//   backgroundColor: "#f0f4f8",
//   cursor: "pointer",
//   transition: "background-color 0.3s ease",
//   "&:hover": {
//     backgroundColor: "#e0eaf2",
//   },
// }));

// const StyledTable = styled("table")(({ theme }) => ({
//   width: "100%",
//   borderCollapse: "collapse",
//   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//   borderRadius: "10px",
//   overflow: "hidden",
// }));

// const StyledTableHeader = styled("th")(({ theme }) => ({
//   backgroundColor: "#1976D2",
//   color: "#fff",
//   padding: "12px",
//   textAlign: "left",
// }));

// const StyledTableRow = styled("tr")(({ theme }) => ({
//   backgroundColor: "#fff",
//   "&:nth-of-type(even)": {
//     backgroundColor: "#f9f9f9",
//   },
//   "&:hover": {
//     backgroundColor: "#f1f1f1",
//   },
// }));

// const StyledTableCell = styled("td")(({ theme }) => ({
//   padding: "12px",
//   borderBottom: "1px solid #ddd",
// }));

// const PaginationContainer = styled("div")(({ theme }) => ({
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   gap: "10px",
//   marginTop: "20px",
// }));



//   const [openDialog, setOpenDialog] = useState(false);
//   const [documentIdToDelete, setDocumentIdToDelete] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const itemsPerPage = 30;
//   const [isLoading, setIsLoading] = useState(true);
//   const { alldocuments, loading, error, host } = useSelector((state) => state.usercart);

//   // Filter documents based on search query
//   const filteredDocuments = useMemo(() => {
//     return alldocuments.filter((doc) =>
//       doc.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [alldocuments, searchQuery]);

//   // Paginate documents
//   const paginatedDocuments = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredDocuments.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredDocuments, currentPage, itemsPerPage]);

//   // Calculate total pages
//   const totalPages = useMemo(() =>
//     Math.ceil(filteredDocuments.length / itemsPerPage),
//     [filteredDocuments, itemsPerPage]
//   );

//   // Handle pagination
//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Handle search input change
//   const handleSearchChange = (event) => {
//     const newQuery = event.target.value;
//     if (newQuery !== searchQuery) {
//       setSearchQuery(newQuery);
//       setCurrentPage(1);
//     }
//   };

//   // Handle delete confirmation dialog
//   const handleDeleteClick = (id) => {
//     setDocumentIdToDelete(id);
//     setOpenDialog(true);
//   };

//   // Fetch documents on component mount

//   // Handle document deletion
//   const handleConfirmDelete = () => {
//     dispatch(deleteDocumentAction(documentIdToDelete));
//     setOpenDialog(false);
//     setDocumentIdToDelete(null);
//   };

//   const handleCancelDelete = () => {
//     setOpenDialog(false);
//     setDocumentIdToDelete(null);
//   };





//   const dispatch = useDispatch();
 
//   useEffect(() => {
//     dispatch(getDocumentAction());
//   }, [dispatch]);


//     const onDrop = (acceptedFiles) => {
//     const allowedTypes = [
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       "application/msword",
//       "application/pdf",
//       "image/vnd.djvu",
//       "image/x-djvu",
//     ];
//     const validFiles = acceptedFiles.filter((file) =>
//       allowedTypes.includes(file.type)
//     );

//     if (validFiles.length > 0) {
//       dispatch(createDocumentAction(validFiles[0], validFiles[0].name));
//     } else {
//       alert("Please upload only .docx, .doc, .pdf, or .djvu files.");
//     }
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: {
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
//       "application/msword": [".doc"],
//       "application/pdf": [".pdf"],
//       "image/vnd.djvu": [".djvu"],
//       "image/x-djvu": [".djvu"],
//     },
//   });
//   const handleDownload = async(id) => {
    
//     const docToDownload = alldocuments.find((doc) => doc.id == id);

//         if (!docToDownload) {
//           console.error(`Document with ID ${id} not found.`);
//           return;
//         }
    
//         try {
//           const downloadUrl = `http://localhost:8000/${docToDownload.path}`;
//           const response = await fetch(downloadUrl);
    
//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
    
//           const blob = await response.blob();
//           const url = window.URL.createObjectURL(blob);
//           const link = document.createElement("a");
//           link.href = url;
//           link.setAttribute("download", docToDownload.name || "file");
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//           window.URL.revokeObjectURL(url);
//         } catch (error) {
//           console.error("Error downloading file:", error);
//           setError("Failed to download file");
//         }
//   };

//   if (loading) return <p>Загрузка...</p>;
//   if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

//   return (
//     <div>
//         <StyledDropzone {...getRootProps()}>
//         <input {...getInputProps()} />
//         <CloudUploadIcon style={{ fontSize: "48px", color: "#1976D2" }} />
//         <Typography variant="body1" style={{ marginTop: "10px" }}>
//           Drag and drop a .docx file here, or click to select a file
//         </Typography>
//       </StyledDropzone>
//       <h2>Список документов</h2>
//       {alldocuments.length === 0 ? (
//         <p>Нет доступных документов</p>
//       ) : (
//         <table border="1">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Название</th>
//               <th>Скачать</th>
//             </tr>
//           </thead>
//           <tbody>
//             {alldocuments.map((doc) => (
//               <tr key={doc.id}>
//                 <td>{doc.id}</td>
//                 <td>{doc.name}</td>
//                 <td>
//                   <button onClick={() => handleDownload(doc.id)}>Скачать</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default DocumentList;
