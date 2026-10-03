"use client";

import { Check, ChevronDown, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Language } from "@/lib/languages";
import { motion } from "framer-motion";

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  isDarkMode: boolean;
}

export default function LanguageSelector({
  languages,
  selectedLanguage,
  onLanguageChange,
  isDarkMode,
}: LanguageSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`w-40 justify-between ${
            isDarkMode
              ? "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
              : "bg-white border-gray-300 text-zinc-800 hover:bg-gray-100"
          } transition-colors duration-200`}
        >
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-sky-500" />
            <span>{selectedLanguage.name}</span>
          </div>
          <ChevronDown
            className={`ml-2 h-4 w-4 ${
              isDarkMode ? "text-zinc-400" : "text-zinc-500"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-40 ${
          isDarkMode
            ? "bg-zinc-800 border-zinc-700"
            : "bg-white border-gray-200"
        } shadow-xl rounded-md overflow-hidden backdrop-blur-lg`}
      >
        <DropdownMenuGroup>
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.id}
              className={`flex items-center justify-between cursor-pointer ${
                selectedLanguage.id === language.id
                  ? isDarkMode
                    ? "bg-zinc-700"
                    : "bg-gray-100"
                  : ""
              } transition-colors duration-200`}
              onClick={() => onLanguageChange(language)}
            >
              <motion.div
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Code2
                  className={`h-4 w-4 ${
                    selectedLanguage.id === language.id
                      ? "text-sky-500"
                      : isDarkMode
                      ? "text-zinc-400"
                      : "text-zinc-500"
                  }`}
                />
                <span>{language.name}</span>
              </motion.div>
              {selectedLanguage.id === language.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Check className="h-4 w-4 text-sky-500" />
                </motion.div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
