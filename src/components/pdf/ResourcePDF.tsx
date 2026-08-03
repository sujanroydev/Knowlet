import {
  Document,
  Page,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
  },
});

export default function ResourcePDF({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.content}>
          {content.replace(/<[^>]+>/g, "")}
        </Text>
      </Page>
    </Document>
  );
}