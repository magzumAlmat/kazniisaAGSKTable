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

const PaginationContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  marginTop: "20px",
}));

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
    setSearchQuery(newQuery);
    setCurrentPage(1); // Reset to the first page on new search
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
  const handleDownloadClick = async (id) => {
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
    }
  };

  // Loading state
  if (loading) {
    return <CircularProgress />;
  }

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

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">MIME Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDocuments.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.mimetype}</TableCell>
                <TableCell align="right">
                  <button onClick={() => handleDownloadClick(row.id)}>Скачать</button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteClick(row.id)}
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