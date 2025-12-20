import { Box, Spinner } from "@chakra-ui/react";
import mermaid from "mermaid";
import { useEffect, useId, useState } from "react";
import { useColorMode } from "./ui/color-mode";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  fontFamily: "inherit",
});

interface MermaidProps {
  chart: string;
}

export const Mermaid = ({ chart }: MermaidProps) => {
  const id = useId().replace(/:/g, "");
  const { colorMode } = useColorMode();
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const renderChart = async () => {
      try {
        // Re-initialize with current theme before rendering
        mermaid.initialize({
          theme: colorMode === "dark" ? "dark" : "default",
        });
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        setSvg(svg);
        setError(false);
      } catch (e) {
        console.error("Mermaid rendering failed", e);
        setError(true);
      }
    };

    void renderChart();
  }, [chart, id, colorMode]);

  if (error) {
    return (
      <Box className="mermaid" p={4} color="red.500" border="1px solid" borderColor="red.500" borderRadius="md">
        Failed to render Mermaid diagram.
      </Box>
    );
  }

  if (!svg) {
    return (
      <Box className="mermaid" display="flex" justifyContent="center" p={4}>
        <Spinner size="xs" color="fg.info" />
      </Box>
    );
  }

  return <Box className="mermaid" dangerouslySetInnerHTML={{ __html: svg }} />;
};
