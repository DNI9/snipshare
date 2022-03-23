import { Box } from '@chakra-ui/react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsLight';

import { SnippetWithLikes } from '~/types/snippet';

type Props = {
  snippet: SnippetWithLikes;
};

export const CodeHighlighter = ({ snippet }: Props) => {
  return (
    <Highlight
      {...defaultProps}
      code={snippet.content}
      language={snippet.language as Language}
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
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </Box>
      )}
    </Highlight>
  );
};
