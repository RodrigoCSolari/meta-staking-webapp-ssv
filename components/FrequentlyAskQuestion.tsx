import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Flex,
  Heading,
  Circle,
} from "@chakra-ui/react";
import React from "react";
import { primaryColor } from "../constants/colors";
import { FAQ, Question } from "../constants/faq";

const FrequentlyAskQuestion = () => {
  return (
    <section>
      <Container id="faq" pb={16}>
        <Flex
          justifyContent={{ base: "center", md: "center" }}
          flexDirection={{ base: "column", md: "column" }}
        >
          <Heading
            lineHeight={"133%"}
            textAlign={"center"}
            fontWeight="500"
            color="gray.900"
            fontSize={"3xl"}
          >
            {" "}
            FAQ
          </Heading>

          <Accordion mt={"40px"} allowMultiple bg="whiteAlpha.600">
            {FAQ.map((item: Question, index: any) => {
              return (
                <Box
                  key={"faq" + index}
                  borderTop={"1px"}
                  borderColor="gray.200"
                >
                  <AccordionItem>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton
                            border={"0px"}
                            borderColor="gray.200"
                            pt={10}
                            pb={10}
                          >
                            <Box
                              color="gray.900"
                              fontWeight={500}
                              fontSize={"md"}
                              flex="1"
                              textAlign="left"
                            >
                              {item.title}
                            </Box>
                            <Circle
                              border={"2px"}
                              m={1}
                              borderColor={primaryColor[500]}
                              borderRadius={100}
                              p={1}
                            >
                              {isExpanded ? (
                                <MinusIcon
                                  color={primaryColor[500]}
                                  fontSize="12px"
                                />
                              ) : (
                                <AddIcon
                                  color={primaryColor[500]}
                                  fontSize="12px"
                                />
                              )}
                            </Circle>
                          </AccordionButton>
                        </h2>
                        <AccordionPanel
                          fontWeight={400}
                          color="gray.800"
                          dangerouslySetInnerHTML={{ __html: item.text }}
                          pb={4}
                          px={8}
                        ></AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                </Box>
              );
            })}
          </Accordion>
        </Flex>
      </Container>
    </section>
  );
};

export default FrequentlyAskQuestion;
