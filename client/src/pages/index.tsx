import { Grid, Typography } from "@mui/material";

export default function Home() {
  return (
    <Grid
      container
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography style={{ color: "black" }}>
        Go to http://localhost:3000/sku/27773-02 for example
      </Typography>
    </Grid>
  );
}
