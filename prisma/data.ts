type CodeType = {
  title: string;
  language: string;
  content: string;
  description?: string;
};

export const codes: Array<CodeType> = [
  {
    title: 'Snip 1 ts',
    language: 'typescript',
    content: `const getRandomFromArray = <T = any>(arr: Array<T>) =>
arr[Math.floor(Math.random() * arr.length)];`,
  },
  //   {
  //     title: 'Snip 2 js',
  //     language: 'javascript',
  //     content: `fruits.forEach(function(item, index, array) {
  // console.log(item, index)`,
  //   },
  //   {
  //     title: 'Snip 3 tsx',
  //     language: 'tsx',
  //     content: `import React from 'react'

  // export const MyCode = () => {
  //   return (
  //     <div>MyCode</div>
  //   )
  // }`,
  //   },
  //   {
  //     title: 'Snip 4 ts',
  //     language: 'typescript',
  //     content: `type FeatureFlags = {
  //   darkMode: () => void;
  //   newUserProfile: () => void;
  // };

  // type FeatureOptions = OptionsFlags<FeatureFlags>;`,
  //   },
  //   {
  //     title: 'Snip 5 ts',
  //     language: 'typescript',
  //     content: `interface Person {
  //   name: string;
  //   age: number;
  // }

  // function greet(person: Person) {
  //   return "Hello " + person.name;
  // }`,
  //   },
  //   {
  //     title: 'Snip 6 ts',
  //     language: 'typescript',
  //     content: `function padLeft(padding: number | string, input: string) {
  //   if (typeof padding === "number") {
  //     return " ".repeat(padding) + input;
  //   }
  //   return padding + input;
  // }`,
  //   },
  //   {
  //     title: 'Snip 7 ts',
  //     language: 'typescript',
  //     content: `class Point {
  //   x = 0;
  //   y = 0;
  // }

  // const pt = new Point();`,
  //   },
  //   {
  //     title: 'Snip 1 go',
  //     language: 'go',
  //     content: `func createFile(p string) *os.File {
  // 	fmt.Println("creating")
  // 	f, err := os.Create(p)
  // 	if err != nil {
  // 		panic(err)
  // 	}
  // 	return f
  // }`,
  //   },
  {
    title: 'Snip 2 go',
    language: 'go',
    content: `func visit(p string, info os.FileInfo, err error) error {
	if err != nil {
		return err
	}
	fmt.Println(" ", p, info.IsDir())
	return nil
}`,
  },
];
