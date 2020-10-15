import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Command from './Command';
import CommandLine from './CommandLine';
import theme from './theme';
import rollupIntoCommands from './rollupIntoCommands';
import { useTimeout } from '@newrelic/gatsby-theme-newrelic';

const Shell = ({ animate, highlight, code }) => {
  const [step, setStep] = useState(0);
  const { tokens, getTokenProps } = highlight;
  const commands = rollupIntoCommands(tokens, code);
  const shownCommands = animate ? commands.slice(0, step) : commands;
  const done = animate ? step >= commands.length : true;

  useTimeout(
    () => {
      setStep((step) => step + 1);
    },
    animate ? 3000 : null
  );

  return (
    <pre
      css={css`
        ${theme};

        padding: 1rem;
        font-family: var(--code-font);
        font-size: 0.75rem;
        border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
        color: var(--color-nord-6);
        display: block;
        overflow: auto;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        tab-size: 2;
        hyphens: none;
        text-shadow: none;

        > code {
          background: none;
          padding: 0;
          width: 100%;
        }

        .token-line {
          display: grid;
          grid-template-columns: 1ch 1fr;
          grid-gap: 1rem;
        }
      `}
    >
      <code>
        {shownCommands.map((command, idx) => (
          <Command
            key={idx}
            animate={animate}
            command={command}
            getTokenProps={getTokenProps}
            onRendered={() => {
              setTimeout(() => {
                setStep((step) => step + 1);
              }, 1000);
            }}
          />
        ))}
        {!done && <CommandLine cursor line={[]} prompt="$" />}
      </code>
    </pre>
  );
};

Shell.propTypes = {
  animate: PropTypes.bool,
  code: PropTypes.string.isRequired,
  highlight: PropTypes.shape({
    tokens: PropTypes.array.isRequired,
    getTokenProps: PropTypes.func.isRequired,
  }),
};

export default Shell;