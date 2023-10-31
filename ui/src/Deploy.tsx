import { Box, Stack, Typography } from "@mui/material";
import { AnimatedPage } from "./AnimatedPage";

export function Deploy() {
    return (
        <>
        <AnimatedPage>
        <Stack spacing={2}>
            <Box textAlign={'center'}>
            <Typography variant='h2'>Deploy</Typography>
            </Box>
        </Stack>
        </AnimatedPage>
        </>
    )
}