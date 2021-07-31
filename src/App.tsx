import { Box, Button, Container } from "@material-ui/core";
import { useState, useEffect } from "react";
import MenuAppBar from "./AppBar";
import SelectableTable from "./SelectableTable";

type ClientPrincipal = {
  userId: string;
  userRoles: string[];
  userDetails: string;
} | null;

async function getUserInfo() {
  const response = await fetch("/.auth/me");
  const payload = await response.json();
  const { clientPrincipal } = payload;
  return clientPrincipal;
}

function App() {
  const [clientPrincipal, setClientPrincipal] = useState<ClientPrincipal>(null);
  useEffect(() => {
    (async function () {
      setClientPrincipal(await getUserInfo());
    })();
  }, []);
  return (
    <Box>
      <MenuAppBar userName={clientPrincipal?.userDetails} />
      <Container maxWidth="md">
        <Box my={5}>
          {clientPrincipal ? (
            <SelectableTable />
          ) : (
            <Container maxWidth="sm">
              <Box display="flex" justifyContent="space-between">
                <Button variant="contained" href="/login/aad">
                  Azure AD
                </Button>
                <Button variant="contained" href="/login/google">
                  Google
                </Button>
                <Button variant="contained" href="/login/twitter">
                  Twitter
                </Button>
                <Button variant="contained" href="/login/facebook">
                  Facebook
                </Button>
                <Button variant="contained" href="/login/github">
                  GitHub
                </Button>
              </Box>
            </Container>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default App;
