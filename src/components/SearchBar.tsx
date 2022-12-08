import { InputBase, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { debounce } from "../utils/utils";

interface IProps {
  handleSearch: (value: string) => void;
}

const SearchBar: React.FC<IProps> = (props) => {
  const { handleSearch } = props;

  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search by name, email, role"
        inputProps={{ "aria-label": "search users" }}
        onChange={debounce(
          (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            handleSearch(e.target.value)
        )}
      />
      <IconButton type="button" sx={{ p: 0.5 }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default React.memo(SearchBar);
