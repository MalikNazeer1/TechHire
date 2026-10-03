export interface Language {
  id: string;
  name: string;
  monacoId: string;
  pistonId: string;
  defaultCode: string;
}

export const languages: Language[] = [
  {
    id: "javascript",
    name: "JavaScript",
    monacoId: "javascript",
    pistonId: "javascript",
    defaultCode: `// JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`fibonacci(\${i}) = \${fibonacci(i)}\`);
}`,
  },
  {
    id: "typescript",
    name: "TypeScript",
    monacoId: "typescript",
    pistonId: "typescript",
    defaultCode: `// TypeScript Example
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`fibonacci(\${i}) = \${fibonacci(i)}\`);
}`,
  },
  {
    id: "python",
    name: "Python",
    monacoId: "python",
    pistonId: "python",
    defaultCode: `# Python Example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci sequence:")
for i in range(10):
    print(f"fibonacci({i}) = {fibonacci(i)}")`,
  },
  {
    id: "java",
    name: "Java",
    monacoId: "java",
    pistonId: "java",
    defaultCode: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Fibonacci sequence:");
        for (int i = 0; i < 10; i++) {
            System.out.println("fibonacci(" + i + ") = " + fibonacci(i));
        }
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
  },
  {
    id: "csharp",
    name: "C#",
    monacoId: "csharp",
    pistonId: "csharp",
    defaultCode: `// C# Example
using System;

class Program {
    static void Main() {
        Console.WriteLine("Fibonacci sequence:");
        for (int i = 0; i < 10; i++) {
            Console.WriteLine($"fibonacci({i}) = {Fibonacci(i)}");
        }
    }
    
    static int Fibonacci(int n) {
        if (n <= 1) return n;
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }
}`,
  },
  {
    id: "cpp",
    name: "C++",
    monacoId: "cpp",
    pistonId: "cpp",
    defaultCode: `// C++ Example
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << "Fibonacci sequence:" << endl;
    for (int i = 0; i < 10; i++) {
        cout << "fibonacci(" << i << ") = " << fibonacci(i) << endl;
    }
    return 0;
}`,
  },
  {
    id: "c",
    name: "C",
    monacoId: "c",
    pistonId: "c",
    defaultCode: `// C Example
#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("Fibonacci sequence:\\n");
    for (int i = 0; i < 10; i++) {
        printf("fibonacci(%d) = %d\\n", i, fibonacci(i));
    }
    return 0;
}`,
  },
  {
    id: "go",
    name: "Go",
    monacoId: "go",
    pistonId: "go",
    defaultCode: `// Go Example
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println("Fibonacci sequence:")
    for i := 0; i < 10; i++ {
        fmt.Printf("fibonacci(%d) = %d\\n", i, fibonacci(i))
    }
}`,
  },
  {
    id: "rust",
    name: "Rust",
    monacoId: "rust",
    pistonId: "rust",
    defaultCode: `// Rust Example
fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    println!("Fibonacci sequence:");
    for i in 0..10 {
        println!("fibonacci({}) = {}", i, fibonacci(i));
    }
}`,
  },
];
