import type { BoxProps } from '@chakra-ui/layout';
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsLight';
import { BiGitRepoForked } from 'react-icons/bi';
import { FaClone, FaHeart } from 'react-icons/fa';

const exampleCode = `
const AppConfig = {
  site_name: 'SnipShare',
  title: 'SnipShare',
  site_url: 'https://google.com',
  description: 'Create, Share and explore code snippets',
  locale: 'en',
};
`.trim();

const MotionBox = motion<BoxProps>(Box);

export const SnippetCard = () => {
  return (
    <MotionBox
      whileHover={{ scale: 1.01 }}
      _hover={{
        boxShadow: 'xl',
        border: '1px',
        borderColor: 'gray.100',
      }}
      p={3}
      rounded="md"
      border="1px"
      borderColor="gray.50"
      boxShadow="md"
    >
      <HStack>
        <Heading size="md">Javascript one liner</Heading>
        <Spacer />
        <IconButton
          variant="ghost"
          aria-label="Fork snippet"
          fontSize="lg"
          icon={<BiGitRepoForked />}
        />
        <IconButton
          variant="ghost"
          aria-label="Like this snippet"
          fontSize="lg"
          icon={<FaHeart />}
        />
        <IconButton
          variant="ghost"
          aria-label="Copy snippet"
          fontSize="lg"
          icon={<FaClone />}
        />
      </HStack>
      <Text color="gray" fontSize="sm">
        2 days ago
      </Text>
      <Box p={2} mt={2}>
        <Highlight
          {...defaultProps}
          code={exampleCode}
          language="javascript"
          theme={theme}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Box
              border="1px"
              borderColor="gray.100"
              p={2}
              rounded="md"
              as="pre"
              overflowX="auto"
              className={className}
              style={style}
            >
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })} key={i}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </Box>
          )}
        </Highlight>
      </Box>
    </MotionBox>
  );
};
