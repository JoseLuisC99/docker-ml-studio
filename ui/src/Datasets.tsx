import { Box, Stack, Typography } from "@mui/material";
import { AnimatedPage } from "./AnimatedPage";

export function Datasets() {
    return (
        <>
        <AnimatedPage>
        <Stack spacing={2}>
            <Box textAlign={'center'}>
            <Typography variant='h2'>Datasets</Typography>
            </Box>
        </Stack>
        </AnimatedPage>
        </>
    )
}