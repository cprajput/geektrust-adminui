import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  FormLabel,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { IUsers } from "../types/dashboard.types";

interface IProps {
  open: boolean;
  handleClose: () => void;
  handleUpdateUserDetails: (id: string, updatedData: IUsers) => void;
  data: IUsers;
}

const EditUserDetails: React.FC<IProps> = (props) => {
  const { open, handleClose, data, handleUpdateUserDetails } = props;

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(4, "Name should contain at least 4 characters")
      .required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    role: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: data.name,
      email: data.email,
      role: data.role,
    },
    validationSchema,
    onSubmit: (values) => {
      const { name, email, role } = values;
      handleUpdateUserDetails(data.id, { id: data.id, name, role, email });
      handleClose();
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{data.name}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Box component="section">
            <TextField
              margin="dense"
              id="name"
              label="Name"
              fullWidth
              variant="outlined"
              required
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              {...(formik.touched &&
                formik.errors.name && {
                  helperText: formik.errors.name,
                  error: true,
                })}
            />
            <TextField
              margin="dense"
              id="email"
              label="Email"
              fullWidth
              variant="outlined"
              required
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              {...(formik.touched &&
                formik.errors.email && {
                  helperText: formik.errors.email,
                  error: true,
                })}
            />
            <FormControl sx={{ mt: 1 }}>
              <FormLabel id="role-radio-buttons-group-label">Role</FormLabel>
              <RadioGroup
                aria-labelledby="role"
                defaultValue="member"
                name="role"
                id="role"
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  value="member"
                  control={<Radio />}
                  label="Member"
                />
                <FormControlLabel
                  value="admin"
                  control={<Radio />}
                  label="Admin"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box component="section" sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Update
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(EditUserDetails);
