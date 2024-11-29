import { CircularProgress, Grid2, IconButton, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import backIcon from "../icons/Back.png";
import placeHolderImage from "../icons/placeHolderImage.png";
import searchIcon from "../icons/search.png";
import { useNavigate } from "react-router";

const imageUrl = "https://test.create.diagnal.com/images/";

const ListingPage = () => {
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ status: 0, message: "" });
  const [searchText, setSearchText] = useState("");
  const [totalData, setTotalData] = useState([]);
  useEffect(() => {
    if (errorMessage.status !== 403 && searchText === "") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  const fetchData = async () => {
    setLoading(true);
    await axios
      .get(`https://test.create.diagnal.com/data/page${pageNo}.json`)
      .then((res) => {
        if (res.data && res.data.page) {
          setTitle(res.data.page.title);
          const formattedData = res.data.page["content-items"].content.map((item) => {
            return { name: item.name, image: item["poster-image"].includes("posterthatismissing") ? "" : imageUrl + item["poster-image"] };
          });
          setLoading(false);
          setData([...data, ...formattedData]);
          setTotalData([...totalData, ...formattedData]);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.status === 403) {
          setErrorMessage({ status: 403, message: "No more data to show" });
        }
        setLoading(false);
      });
  };

  const handleScroll = () => {
    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10;
    if (bottom) {
      setPageNo((pageNo) => pageNo + 1);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if ((searchText !== "") & (searchText.length > 2)) {
      const formattedData = data.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
      setData(formattedData);
    } else if (searchText === "") {
      setData(totalData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <>
      <Grid2 container item alignItems="center" justifyContent="space-between" flexDirection="row" style={{ paddingTop: "1rem", paddingBottom: "1rem", width: "100%", position: "fixed", top: 0, zIndex: 100, backgroundColor: "#171717" }}>
        <Grid2 container item size={7} alignItems="center">
          <IconButton onClick={() => navigate("/")}>
            <img src={backIcon} alt="back button" style={{ width: "2rem", height: "2rem" }} />
          </IconButton>
          <Typography variant="h5" style={{ fontWeight: 400, width: "fit-content" }}>
            {title}
          </Typography>
        </Grid2>
        <Grid2 container item alignItems="center">
          <TextField value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: "80%", border: "1px solid grey" }} slotProps={{ input: { style: { color: "white" } } }} />
          <IconButton>
            <img src={searchIcon} alt="back button" style={{ width: "2rem", height: "2rem" }} />
          </IconButton>
        </Grid2>
      </Grid2>

      <Grid2 container style={{ overflowX: "hidden", marginTop: "5rem" }} alignItems="center">
        <Grid2 container item flexDirection="row" spacing={2}>
          {loading && data.length === 0 ? <CircularProgress /> : null}
          {data && data.length > 0
            ? data.map((item) => (
                <Grid2 item size={4}>
                  <img src={item.image !== "" ? item.image : placeHolderImage} alt={item.name} style={{ width: "95%", height: "95%", objectFit: "contain" }} />
                  <Typography variant="h6">{item.name}</Typography>
                </Grid2>
              ))
            : null}
        </Grid2>
        <Grid2 item style={{ alignSelf: "center", width: "100%", marginTop: "2rem" }}>
          {errorMessage.status === 403 ? (
            <Typography variant="h4" textAlign="center">
              {errorMessage.message}
            </Typography>
          ) : null}
        </Grid2>
      </Grid2>
    </>
  );
};

export default ListingPage;
